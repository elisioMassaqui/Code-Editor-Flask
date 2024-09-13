// Configuração do CDN do editor
require.config({
    paths: { 
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0-dev-20240628/min/vs' 
    }
});

// Inicializa o editor de código e configurações
require(['vs/editor/editor.main'], function() {
    // Seleção dos elementos DOM
    const elements = {
        createProjectButton: document.getElementById('createProjectButton'),
        loadProjectButton: document.getElementById('loadProjectButton'),
        deleteProjectButton: document.getElementById('deleteProjectButton'),
        saveCodeButton: document.getElementById('saveCodeButton'),
        compileCodeButton: document.getElementById('compileCodeButton'),
        uploadCodeButton: document.getElementById('uploadCodeButton'),
        loadProjectSelect: document.getElementById('loadProjectSelect'),
        codeEditorContainer: document.getElementById('codeEditor'),
        consoleDiv: document.getElementById('console'),
        pegarPortas: document.getElementById('pegarPortas')
    };

    function showSpinner() {
        document.getElementById('spinner-container').style.display = 'flex';
    }
    
    function hideSpinner() {
        document.getElementById('spinner-container').style.display = 'none';
    }

    // Configura o editor de código
    const codeEditor = monaco.editor.create(elements.codeEditorContainer, {
        value: '',
        language: 'cpp',
        theme: 'vs-dark',
        fontSize: 18,
        lineHeight: 22,
        minimap: { enabled: false }
    });

// Função para criar um elemento de mensagem com a cor especificada
function createMessageElement(message, color) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.color = color; // Define a cor do texto para esta mensagem
    return messageElement;
}

let Vermelho = '#EF0107'
let Azul = '#0096FF'

// Atualiza o console com uma mensagem e cor específica
function updateConsole(message, color) {
    const consoleDiv = document.getElementById('console');
    // Cria um novo elemento para a mensagem com a cor especificada
    const messageElement = createMessageElement(message, color);
    // Adiciona o novo elemento ao console
    consoleDiv.appendChild(messageElement);
    // Role o console para mostrar a mensagem mais recente
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Função para limpar o console
function clearConsole() {
    document.getElementById('console').innerHTML = '';
}

// Adiciona um ouvinte de evento para um atalho de teclado (por exemplo, Delete)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete') {
        clearConsole();
    }
});


    // Mostra um alerta para o usuário
    function showAlert(message) {
        alert(message);
    }

    // Atualiza a lista de projetos na interface
    async function updateProjectsList() {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            elements.loadProjectSelect.innerHTML = '';
            data.forEach(project => {
                const option = document.createElement('option');
                option.value = project;
                option.textContent = project;
                elements.loadProjectSelect.appendChild(option);
            });
        } catch (error) {
            updateConsole(`Erro ao carregar a lista de projetos: ${error.message, Vermelho}`);
        }
    }
        // Atualiza a lista de projetos ao iniciar o app
        updateProjectsList();

// Atualiza a lista de portas
async function updatePortList() {
    showSpinner(); // Supondo que essa função exibe um spinner
    try {
        const response = await fetch('/api/portas');
        const data = await response.json();
        
        if (data.ports) {
            // Atualize o console com uma mensagem azul
            updateConsole(`Portas detectadas: ${data.ports.join(', ')}`, Azul);
        } else if (data.message) {
            // Atualize o console com uma mensagem
            updateConsole(data.message, Vermelho);
        }
    } catch (error) {
        // Atualize o console com uma mensagem vermelha
        updateConsole(`Erro ao carregar portas: ${error.message}`, Vermelho);
    } finally {
        hideSpinner(); // Supondo que essa função oculta o spinner
    }
}


    // Cria um novo projeto
    async function createProject() {
        const projectName = prompt("Por favor, insira o nome do projeto", "Wandi Studio");
        if (!projectName) {
            return;
        }
        try {
            const response = await fetch('/api/create_project', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            updateConsole(data.message, Azul);
            await updateProjectsList();
        } catch (error) {
            updateConsole(`Erro ao criar projeto: ${error.message, Vermelho}`);
        }
    }

    // Carrega um projeto selecionado
    async function loadProject() {
        const projectName = elements.loadProjectSelect.value;
        if (!projectName) {
            return;
        }
        try {
            const response = await fetch(`/api/load_code?project_name=${projectName}`);
            const data = await response.json();
            if (data.code) {
                codeEditor.setValue(data.code);
            } else {
                updateConsole(data.message, Vermelho);
                showAlert(data.message);
            }
        } catch (error) {
            updateConsole(`Erro ao carregar código: ${error.message, Vermelho}`);
        }
    }

    // Deleta um projeto
    async function deleteProject() {
        const projectName = elements.loadProjectSelect.value;
        if (!projectName) {
            alert('Selecione um projeto, por favor');
            return;
        }
        try {
            const response = await fetch('/api/delete_project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            showAlert(data.message);
            updateConsole(data.message, Azul);
            await updateProjectsList();
        } catch (error) {
            updateConsole(`Erro ao deletar projeto: ${error.message, Vermelho}`);
        }
    }

    // Salva o código no projeto selecionado
    async function saveCode() {
        const projectName = elements.loadProjectSelect.value.trim();
        const code = codeEditor.getValue();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        showSpinner()
        try {
            const response = await fetch('/api/save_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName, code: code })
            });
            const data = await response.json();
            updateConsole(data.message, Azul);
        } catch (error) {
            updateConsole(`Erro ao salvar código: ${error.message, Vermelho}`);
        }
        finally {
            hideSpinner();
        }
    }

    // Compila o código do projeto selecionado
    async function compileCode() {
        const projectName = elements.loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        showSpinner()
        try {
            const response = await fetch('/api/compile_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output, Azul);
            }
            if (data.error) {
                alert('Salve o código antes de compilar. Se o erro persistir, verifique o console');
                updateConsole(data.error, Vermelho);
            }
        } catch (error) {
            updateConsole(`Erro ao compilar código: ${error.message, Vermelho}`);
        }
        finally {
            hideSpinner();
        }
    }

    // Envia o código compilado para o dispositivo ou placa
    async function uploadCode() {
        const projectName = elements.loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        showSpinner()
        try {
            const response = await fetch('/api/upload_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output, Azul);
            }
            if (data.error) {
                alert('Compile o código antes de enviar. Se o erro persistir, verifique o console');
                updateConsole(data.error, Vermelho);
            }
        } catch (error) {
            updateConsole(`Erro ao enviar código: ${error.message, Vermelho}`);
        }
        finally {
            hideSpinner();
        }
    }

    // Adiciona eventos aos botões
    elements.createProjectButton.addEventListener('click', createProject);
    elements.loadProjectButton.addEventListener('click', loadProject);
    elements.deleteProjectButton.addEventListener('click', deleteProject);
    elements.saveCodeButton.addEventListener('click', saveCode);
    elements.compileCodeButton.addEventListener('click', compileCode);
    elements.uploadCodeButton.addEventListener('click', uploadCode);
    elements.pegarPortas.addEventListener('click', updatePortList);

    // Executa salvar, compilar e enviar com um clique
    async function executar() {
        await saveCode();
        await compileCode();
        await uploadCode();
    }

    document.getElementById('code').addEventListener('click', executar);
});
