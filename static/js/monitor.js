let port, writer, reader;
let websocket;
let bytesSent = 0;
let bytesReceived = 0;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
let messageBuffer = '';

// Configura a conexão WebSocket
function setupWebSocket() {
    websocket = new WebSocket('ws://localhost:8765'); // URL do servidor WebSocket Python

    websocket.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
    };

    websocket.onmessage = (event) => {
        console.log('Mensagem recebida do WebSocket:', event.data);
        document.getElementById('serial-output').value += event.data + '\n';
        document.getElementById('serial-output').scrollTop = document.getElementById('serial-output').scrollHeight;  // Rolagem automática
    };

    websocket.onerror = (error) => {
        console.error('Erro WebSocket:', error);
    };

    websocket.onclose = () => {
        console.log('Desconectado do servidor WebSocket');
    };
}

// Atualiza o contador de bytes na interface
function updateStatus() {
    document.getElementById('bytes-sent').textContent = bytesSent;
    document.getElementById('bytes-received').textContent = bytesReceived;
}

// Função para conectar ao Arduino
async function connect() {
    if (port) {
        console.warn('Já há uma conexão ativa.');
        return;
    }

    try {
        port = await navigator.serial.requestPort();
        const baudRate = parseInt(document.getElementById('baud-rate').value, 10);
        await port.open({ baudRate });

        reader = port.readable.getReader();
        writer = port.writable.getWriter();

        setupWebSocket(); // Inicializa o WebSocket
        readData();
    } catch (error) {
        console.error('Erro ao conectar ou ler do dispositivo:', error);
    }
}

// Função para desconectar do Arduino
async function disconnect() {
    if (port) {
        try {
            if (reader) {
                await reader.cancel();
                reader.releaseLock();
            }
            if (writer) {
                await writer.close();
                writer.releaseLock();
            }
            await port.close();
            resetConnection();
        } catch (error) {
            console.error('Erro ao desconectar a porta:', error);
        }
    } else {
        console.warn('Nenhuma porta está conectada.');
    }
}

// Função para limpar o console
function clearConsole() {
    document.getElementById('serial-output').value = '';
}

// Função para enviar dados ao Arduino e WebSocket
async function sendData() {
    const input = document.getElementById('serial-input').value;
    if (writer) {
        try {
            const data = encoder.encode(input + '\n');
            bytesSent += data.length;
            await writer.write(data);
            document.getElementById('serial-input').value = '';
            updateStatus();

            // Envia os dados para o WebSocket
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(input);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    }
}

// Função para ler dados do Arduino
async function readData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Concatena os dados recebidos
            messageBuffer += decoder.decode(value, { stream: true });

            // Processa as mensagens completas
            let endIndex;
            while ((endIndex = messageBuffer.indexOf('\n')) > -1) {
                const message = messageBuffer.substring(0, endIndex).trim();
                messageBuffer = messageBuffer.substring(endIndex + 1);

                // Atualiza a interface
                bytesReceived += message.length;
                document.getElementById('serial-output').value += message + '\n';
                document.getElementById('serial-output').scrollTop = document.getElementById('serial-output').scrollHeight;  // Rolagem automática

                // Envia a mensagem para o WebSocket
                if (websocket && websocket.readyState === WebSocket.OPEN) {
                    websocket.send(message);
                }
            }

            updateStatus();
        }
    } catch (error) {
        console.error('Erro ao ler do dispositivo:', error);
    } finally {
        reader.releaseLock();
    }
}

// Função para resetar o estado da conexão
function resetConnection() {
    port = null;
    writer = null;
    reader = null;
    messageBuffer = '';
}

// Eventos de clique
document.getElementById('connect').addEventListener('click', connect);
document.getElementById('disconnect').addEventListener('click', disconnect);
document.getElementById('send').addEventListener('click', sendData);
document.getElementById('clear').addEventListener('click', clearConsole);

// Evento de pressionar Enter no campo de entrada
document.getElementById('serial-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Evita adicionar uma nova linha no campo de entrada
        await sendData();
    }
});

// Exibir o offcanvas ao clicar no botão
document.getElementById('openMonitorButton').addEventListener('click', function() {
    document.getElementById('MonitorSerial').classList.add('active');
});


// Ocultar o offcanvas
document.getElementById('Ocultar').addEventListener('click', function() {
    document.getElementById('MonitorSerial').classList.remove('active');
});