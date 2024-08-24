//Pesuisar,listar desinstalar e instalar
document.addEventListener('DOMContentLoaded', () => {
    const installedLibrariesSelect = document.getElementById('installedLibrariesSelect');
    const installLibraryButton = document.getElementById('installLibraryButton');
    const uninstallLibraryButton = document.getElementById('uninstallLibraryButton');

    function updateLibraries() {
        fetch('/api/installed_libraries')
            .then(response => response.json())
            .then(data => {
                installedLibrariesSelect.innerHTML = '';
                data.libraries.forEach(library => {
                    const option = document.createElement('option');
                    option.value = library;
                    option.textContent = library;
                    installedLibrariesSelect.appendChild(option);
                });
            });
    }

    function installLibrary() {
        let libraryName = prompt("Por favor, insira o nome da biblioteca a instalar Ex:", "Servo");
        if (!libraryName) {
            alert('Digite o nome da biblioteca para instalar.');
            return;
        }
        fetch('/api/install_library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ library_name: libraryName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateLibraries();
        });
    }

    function uninstallLibrary() {
        const libraryName = installedLibrariesSelect.value;
        if (!libraryName) {
            alert('Selecione uma biblioteca para desinstalar.');
            return;
        }
        fetch('/api/uninstall_library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ library_name: libraryName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateLibraries();
        });
    }

    installLibraryButton.addEventListener('click', installLibrary);
    uninstallLibraryButton.addEventListener('click', uninstallLibrary);

    // Atualiza as bibliotecas ao iniciar
    updateLibraries();
});


//Library Viewver
let librariesData = [];

function toggleOffcanvas() {
    const offcanvas = document.getElementById('offcanvasLibraries');
    offcanvas.classList.toggle('show');
    loadLibraries();

    if (offcanvas.classList.contains('show')) {
        //Tenho que criar um spinner de loading pra melhor interact com user
    }
}

function loadLibraries() {
    if (librariesData.length === 0) {
        fetch('/api/libraries')
            .then(response => response.json())
            .then(data => {
                librariesData = data;
                renderLibraries(librariesData);
                console.log('Carregando libs');
            })
            .catch(error => console.error('Erro ao carregar bibliotecas:', error));
    }
}
loadLibraries();

function renderLibraries(libraries) {
    const container = document.getElementById('librariesContainer');
    container.innerHTML = '';

    libraries.forEach(lib => {
        const libraryHTML = `
            <div class="library-item">
                <h3 style="color: #0056b3;">${lib.Name}</h3>
                <p><strong>Autor:</strong> ${lib.Author}</p>
                <p><strong>Categoria:</strong> ${lib.Category}</p>
                <p><strong>Última Versão:</strong> ${lib.LastVersion}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', libraryHTML);
    });
}

function filterLibraries() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const filteredLibraries = librariesData.filter(lib => lib.Name.toLowerCase().includes(filter));

    renderLibraries(filteredLibraries);
}
