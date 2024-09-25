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
            const status = await response.json();
            if (status.message) {
                //Poder estar num modal
                updateConsole(`${status.message}`);
            }
        } catch (error) {
            updateConsole(`${error.status}`);
        }
        finally {
            hideSpinner();
        }
    }

        // Adiciona eventos aos botões
        elements.instalar.addEventListener('click', instalar);