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

    // Configura o editor de código
    const codeEditor = monaco.editor.create(elements.codeEditorContainer, {
        value: '',
        language: 'cpp',
        theme: 'vs-dark',
        fontSize: 18,
        lineHeight: 22,
        minimap: { enabled: false }
    });

    // Atualiza o console com uma mensagem
    function updateConsole(message) {
        elements.consoleDiv.textContent += message + "\n";
        elements.consoleDiv.scrollTop = elements.consoleDiv.scrollHeight;
    }

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
            updateConsole(`Erro ao carregar a lista de projetos: ${error.message}`);
        }
    }
        // Atualiza a lista de projetos ao iniciar o app
        updateProjectsList();

    // Atualiza a lista de portas
    async function updatePortList() {
        try {
            const response = await fetch('/api/portas');
            const data = await response.json();
            if (data.ports) {
                updateConsole(`Portas detectadas: ${data.ports.join(', ')}`);
            } else if (data.message) {
                updateConsole(data.message);
            }
        } catch (error) {
            updateConsole(`Erro ao carregar portas: ${error.message}`);
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
            updateConsole(data.message);
            await updateProjectsList();
        } catch (error) {
            updateConsole(`Erro ao criar projeto: ${error.message}`);
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
                updateConsole(data.message);
                showAlert(data.message);
            }
        } catch (error) {
            updateConsole(`Erro ao carregar código: ${error.message}`);
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
            updateConsole(data.message);
            await updateProjectsList();
        } catch (error) {
            updateConsole(`Erro ao deletar projeto: ${error.message}`);
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
        try {
            const response = await fetch('/api/save_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName, code: code })
            });
            const data = await response.json();
            updateConsole(data.message);
        } catch (error) {
            updateConsole(`Erro ao salvar código: ${error.message}`);
        }
    }

    // Compila o código do projeto selecionado
    async function compileCode() {
        const projectName = elements.loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        try {
            const response = await fetch('/api/compile_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output);
            }
            if (data.error) {
                alert('Salve o código antes de compilar. Se o erro persistir, verifique o console');
                updateConsole(data.error);
            }
        } catch (error) {
            updateConsole(`Erro ao compilar código: ${error.message}`);
        }
    }

    // Envia o código compilado para o dispositivo ou placa
    async function uploadCode() {
        const projectName = elements.loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        try {
            const response = await fetch('/api/upload_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            });
            const data = await response.json();
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output);
            }
            if (data.error) {
                alert('Compile o código antes de enviar. Se o erro persistir, verifique o console');
                updateConsole(data.error);
            }
        } catch (error) {
            updateConsole(`Erro ao enviar código: ${error.message}`);
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
