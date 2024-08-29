     // Seleção dos elementos DOM
     const elements = {
        consoleDiv: document.getElementById('console'),
        instalar: document.getElementById('instalar')

    };  


        // Atualiza o console com uma mensagem
        function updateConsole(message) {
            elements.consoleDiv.textContent += message + "\n";
            elements.consoleDiv.scrollTop = elements.consoleDiv.scrollHeight;
        }
    
        function showSpinner() {
            document.getElementById('spinner-container').style.display = 'flex';
        }
        
        function hideSpinner() {
            document.getElementById('spinner-container').style.display = 'none';
        }
   
   // Atualiza a lista de portas
    async function instalar() {
        showSpinner();
        try {
            const response = await fetch('/instalar');
            const data = await response.json();
            if (data.message) {
                updateConsole(`${data.message.toUpperCase()}`);
            }
        } catch (error) {
            updateConsole(`Erro ao preparar o ambiente, certifique e o arduino-cli está no diretório do app e que a conexão com internet existe: ${error.message}`);
        }
        finally {
            hideSpinner();
        }
    }

        // Adiciona eventos aos botões
        elements.instalar.addEventListener('click', instalar);