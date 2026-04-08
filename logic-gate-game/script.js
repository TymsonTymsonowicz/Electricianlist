const LEVELS = [
    {
        name: 'AND Gate Basics',
        description: 'Create a circuit that outputs 1 only when both inputs are 1',
        truth_table: [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]],
        hint: 'Use an AND gate. Connect both inputs to the AND gate.'
    },
    {
        name: 'OR Gate Basics',
        description: 'Create a circuit that outputs 1 when at least one input is 1',
        truth_table: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]],
        hint: 'Use an OR gate. Connect both inputs to the OR gate.'
    },
    {
        name: 'XOR Gate Basics',
        description: 'Create a circuit that outputs 1 when inputs are different',
        truth_table: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]],
        hint: 'Use an XOR gate. Connect both inputs to the XOR gate.'
    },
    {
        name: 'NOT Gate: Making NAND',
        description: 'Create NAND: Output opposite of AND (1 when NOT both inputs are 1)',
        truth_table: [[0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 0]],
        hint: 'Connect AND gate to NOT gate. AND output → NOT input.'
    },
    {
        name: 'Complex Logic',
        description: 'Combine gates to match this pattern: (A OR B) AND NOT(A AND B)',
        truth_table: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]],
        hint: 'This is XOR! Use an XOR gate directly, or build it with AND, OR, and NOT.'
    }
];

let currentLevel = 0;
let gameState = {
    gates: [],
    connections: [],
    nextGateId: 1,
    nextConnectionId: 1
};

let draggedFrom = null;
let selectedGate = null;
let tutorialShown = false;
let instructionsVisible = true;

class Gate {
    constructor(type, x, y, id) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.id = id;
        this.inputPorts = this.type === 'NOT' ? 1 : 2;
        this.outputPorts = 1;
        this.inputs = new Array(this.inputPorts).fill(null);
        this.output = null;
    }

    evaluate(inputs) {
        if (inputs.some(i => i === null)) return null;
        
        switch(this.type) {
            case 'AND': return inputs[0] && inputs[1] ? 1 : 0;
            case 'OR': return inputs[0] || inputs[1] ? 1 : 0;
            case 'NOT': return inputs[0] ? 0 : 1;
            case 'XOR': return inputs[0] !== inputs[1] ? 1 : 0;
            default: return null;
        }
    }

    getInputPortPos(index) {
        const portSpacing = 20;
        const startY = this.y + 15;
        return {
            x: this.x - 5,
            y: startY + (index * portSpacing)
        };
    }

    getOutputPortPos() {
        return {
            x: this.x + 85,
            y: this.y + 25 + (this.inputPorts > 1 ? 10 : 0)
        };
    }
}

function initLevel() {
    const level = LEVELS[currentLevel];
    gameState = {
        gates: [],
        connections: [],
        nextGateId: 1,
        nextConnectionId: 1
    };

    updateTargetDisplay(level.truth_table);
    updateStatusBar();
    renderCanvas();
}

function updateStatusBar() {
    const level = LEVELS[currentLevel];
    document.getElementById('level').textContent = currentLevel + 1;
    document.getElementById('level-footer').textContent = currentLevel + 1;
    document.getElementById('status').textContent = level.name;
}

function updateTargetDisplay(truthTable) {
    const display = document.getElementById('target-table');
    let html = '';
    truthTable.forEach(row => {
        html += `<div>${row[0]} ${row[1]} → ${row[2]}</div>`;
    });
    display.innerHTML = html;
}

function createGate(type, x, y) {
    const gate = new Gate(type, x, y, gameState.nextGateId++);
    gameState.gates.push(gate);
    renderCanvas();
    return gate;
}

function createConnection(fromGateId, fromPort, toGateId, toPort) {
    const connection = {
        id: gameState.nextConnectionId++,
        fromGate: fromGateId,
        fromPort: fromPort,
        toGate: toGateId,
        toPort: toPort
    };
    gameState.connections.push(connection);
    renderCanvas();
}

function evaluateCircuit() {
    const level = LEVELS[currentLevel];
    const table = level.truth_table;

    for (let row of table) {
        const [input1, input2, expectedOutput] = row;
        
        // Reset all gates
        gameState.gates.forEach(gate => {
            gate.inputs.fill(null);
            gate.output = null;
        });

        // Find input gates (gates with no incoming connections to input ports)
        const inputGates = gameState.gates.filter(g => {
            const hasInputConnection = gameState.connections.some(c => c.toGate === g.id);
            return !hasInputConnection;
        });

        if (inputGates.length !== 2) continue;

        // Set inputs
        inputGates[0].output = input1;
        if (inputGates.length > 1) inputGates[1].output = input2;

        // Propagate through circuit
        let changed = true;
        while (changed) {
            changed = false;
            gameState.gates.forEach(gate => {
                if (gate.output !== null && gate.output !== undefined) return;

                const incomingConnections = gameState.connections.filter(c => c.toGate === gate.id);
                
                if (incomingConnections.length === gate.inputPorts) {
                    const inputs = new Array(gate.inputPorts);
                    let ready = true;

                    incomingConnections.forEach(conn => {
                        const fromGate = gameState.gates.find(g => g.id === conn.fromGate);
                        if (fromGate.output === null || fromGate.output === undefined) {
                            ready = false;
                            return;
                        }
                        inputs[conn.toPort] = fromGate.output;
                    });

                    if (ready) {
                        gate.output = gate.evaluate(inputs);
                        changed = true;
                    }
                }
            });
        }

        // Find output gate (gate whose output isn't connected to another gate's input)
        const outputGate = gameState.gates.find(g => {
            return !gameState.connections.some(c => c.fromGate === g.id);
        });

        if (!outputGate || outputGate.output === null || outputGate.output !== expectedOutput) {
            return false;
        }
    }

    return true;
}

function renderCanvas() {
    const container = document.getElementById('gates-container');
    const svg = document.getElementById('canvas');
    
    // Clear containers
    container.innerHTML = '';
    svg.innerHTML = '';

    // Draw connections
    gameState.connections.forEach(conn => {
        const fromGate = gameState.gates.find(g => g.id === conn.fromGate);
        const toGate = gameState.gates.find(g => g.id === conn.toGate);

        if (fromGate && toGate) {
            const from = fromGate.getOutputPortPos();
            const to = toGate.getInputPortPos(conn.toPort);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            svg.appendChild(line);

            // Draw circles at endpoints
            [from, to].forEach(pos => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', pos.x);
                circle.setAttribute('cy', pos.y);
                circle.setAttribute('r', 3);
                svg.appendChild(circle);
            });
        }
    });

    // Draw gates
    gameState.gates.forEach(gate => {
        const el = document.createElement('div');
        el.className = 'gate';
        el.style.left = gate.x + 'px';
        el.style.top = gate.y + 'px';
        el.draggable = true;

        let portsHTML = '<div class="gate-ports">';
        for (let i = 0; i < gate.inputPorts; i++) {
            portsHTML += `<div class="port in-port" data-gate="${gate.id}" data-type="in" data-port="${i}"></div>`;
        }
        portsHTML += `<div class="port out-port" data-gate="${gate.id}" data-type="out" data-port="0"></div>`;
        portsHTML += '</div>';

        el.innerHTML = `
            <div class="gate-type">${gate.type}</div>
            ${portsHTML}
        `;

        el.addEventListener('dragstart', (e) => dragGate(e, gate));
        el.addEventListener('dragend', dropGate);
        el.addEventListener('click', (e) => {
            if (!e.target.classList.contains('port')) {
                selectGate(gate);
            }
        });

        // Port click handlers
        el.querySelectorAll('.port.in-port').forEach(port => {
            port.addEventListener('click', (e) => startConnection(e, gate, 'in', parseInt(port.dataset.port)));
        });

        el.querySelectorAll('.port.out-port').forEach(port => {
            port.addEventListener('click', (e) => startConnection(e, gate, 'out', 0));
        });

        container.appendChild(el);
    });
}

function dragGate(e, gate) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('gateId', gate.id);
}

function dropGate(e) {
    e.preventDefault();
    const gateId = parseInt(e.dataTransfer.getData('gateId'));
    const gate = gameState.gates.find(g => g.id === gateId);
    
    if (gate) {
        gate.x = e.clientX - 40;
        gate.y = e.clientY - 25;
        renderCanvas();
    }
}

function startConnection(e, fromGate, type, port) {
    e.stopPropagation();
    draggedFrom = { gate: fromGate, type, port };
    
    const pos = type === 'out' ? fromGate.getOutputPortPos() : fromGate.getInputPortPos(port);
    
    const svg = document.getElementById('canvas');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = 'preview-line';
    line.setAttribute('x1', pos.x);
    line.setAttribute('y1', pos.y);
    line.setAttribute('x2', pos.x);
    line.setAttribute('y2', pos.y);
    svg.appendChild(line);

    document.addEventListener('mousemove', updatePreviewLine);
    document.addEventListener('mouseup', stopConnection);
}

function updatePreviewLine(e) {
    if (!draggedFrom) return;
    const line = document.getElementById('preview-line');
    if (line) {
        line.setAttribute('x2', e.clientX);
        line.setAttribute('y2', e.clientY);
    }
}

function stopConnection(e) {
    document.removeEventListener('mousemove', updatePreviewLine);
    document.removeEventListener('mouseup', stopConnection);
    
    const line = document.getElementById('preview-line');
    if (line) line.remove();

    if (!draggedFrom) return;

    const clickedPort = e.target.closest('.port');
    if (clickedPort) {
        const toGateId = parseInt(clickedPort.dataset.gate);
        const toGate = gameState.gates.find(g => g.id === toGateId);
        const toType = clickedPort.dataset.type;
        const toPort = parseInt(clickedPort.dataset.port);

        if (draggedFrom.type === 'out' && toType === 'in' && draggedFrom.gate.id !== toGate.id) {
            createConnection(draggedFrom.gate.id, 0, toGate.id, toPort);
            
            // Check win condition
            if (evaluateCircuit()) {
                winLevel();
            }
        }
    }

    draggedFrom = null;
}

function selectGate(gate) {
    selectedGate = selectedGate?.id === gate.id ? null : gate;
    renderCanvas();
}

function clearBoard() {
    gameState.gates = [];
    gameState.connections = [];
    gameState.nextGateId = 1;
    renderCanvas();
}

function winLevel() {
    document.getElementById('status').textContent = '✓ Level Complete!';
    document.getElementById('next-btn').style.display = currentLevel < LEVELS.length - 1 ? 'block' : 'none';
}

function nextLevel() {
    if (currentLevel < LEVELS.length - 1) {
        currentLevel++;
        initLevel();
    }
}

// Event listeners
document.querySelectorAll('.gate-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.target.closest('.gate-btn').dataset.gate;
        createGate(type, 50, 50 + gameState.gates.length * 80);
    });
});

document.getElementById('clear-btn').addEventListener('click', clearBoard);
document.getElementById('next-btn').addEventListener('click', nextLevel);

// Tutorial modal
document.getElementById('tutorial-btn').addEventListener('click', showTutorial);
document.getElementById('close-tutorial').addEventListener('click', hideTutorial);
document.getElementById('start-playing').addEventListener('click', () => {
    hideTutorial();
    tutorialShown = true;
});

// Hint button
document.getElementById('hint-btn').addEventListener('click', showHint);

// Instruction overlay
document.getElementById('hide-instructions').addEventListener('click', hideInstructions);

// Drag gates from palette
document.querySelectorAll('.gate-btn').forEach(btn => {
    btn.draggable = true;
    btn.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('gateType', e.target.closest('.gate-btn').dataset.gate);
    });
});

document.querySelector('.gates-container').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

document.querySelector('.gates-container').addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('gateType');
    if (type) {
        createGate(type, e.clientX - 200, e.clientY - 100);
    }
});

// Tutorial functions
function showTutorial() {
    document.getElementById('tutorial-modal').style.display = 'block';
}

function hideTutorial() {
    document.getElementById('tutorial-modal').style.display = 'none';
}

function showHint() {
    const level = LEVELS[currentLevel];
    alert(`💡 Hint: ${level.hint}`);
}

function hideInstructions() {
    document.getElementById('instruction-overlay').style.display = 'none';
    instructionsVisible = false;
}

// Initialize game
initLevel();

// Show tutorial on first load
setTimeout(() => {
    if (!tutorialShown) {
        showTutorial();
    }
}, 1000);
