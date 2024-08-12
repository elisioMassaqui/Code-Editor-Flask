  // Variáveis globais
  let port, writer, reader;
  let bytesSent = 0;
  let bytesReceived = 0;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

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

  // Função para enviar dados ao Arduino
  async function sendData() {
      const input = document.getElementById('serial-input').value;
      if (writer) {
          try {
              const data = encoder.encode(input + '\n');
              bytesSent += data.length;
              await writer.write(data);
              document.getElementById('serial-input').value = '';
              updateStatus();
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
              bytesReceived += value.length;
              const outputElement = document.getElementById('serial-output');
              outputElement.value += decoder.decode(value);
              outputElement.scrollTop = outputElement.scrollHeight;  // Rolagem automática
              updateStatus();
          }
      } catch (error) {
          console.error('Erro ao ler do dispositivo:', error);
      }
  }

  // Função para resetar o estado da conexão
  function resetConnection() {
      port = null;
      writer = null;
      reader = null;
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

// Desativar o offcanvas ao clicar em "Desconectar"
document.getElementById('disconnect').addEventListener('click', function() {
    document.getElementById('MonitorSerial').classList.remove('active');
});