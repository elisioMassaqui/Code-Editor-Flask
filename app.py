import os
import json
import subprocess
from flask import Flask, jsonify, request, render_template
import logging
import re
import threading
import webbrowser
import webview

app = Flask(__name__)

@app.route('/')
def hero():
    #Depois coloque o hero.html aqui e descomente tudo que está comentado pra voltar ao normal
    #Apagando do app.run(debug=True) abaixo e deixando somente ##def start_flask(): app.run() que vai rodar numa thread separada
    return render_template('index.html')

#@app.route('/index')
#def index():
    return render_template('index.html')

#@app.route('/abrirEditor')
#def editor():
    openEditor()
    return jsonify({"open": "abrindoEditor"})

#def openEditor():
    #webbrowser.open("http://127.0.0.1:5000/index")

##def start_flask():
    app.run()

# Configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.join(BASE_DIR, 'projects')
ARDUINO_CLI_PATH = 'arduino-cli'
BOARD_FQBN = 'arduino:avr:uno'

# Funções Utilitárias

def get_project_path(project_name):
    return os.path.join(PROJECTS_DIR, project_name)

def create_project_folder(project_name):
    project_path = get_project_path(project_name)
    if not os.path.exists(project_path):
        os.makedirs(project_path)
        with open(os.path.join(project_path, f"{project_name}.ino"), 'w') as f:
            f.write('// Código Arduino aqui\n')
        return True
    return False

def delete_project_folder(project_name):
    project_path = get_project_path(project_name)
    if os.path.exists(project_path):
        for root, dirs, files in os.walk(project_path, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        os.rmdir(project_path)
        return True
    return False

@app.route('/api/projects', methods=['GET'])
def list_projects():
    projects = [d for d in os.listdir(PROJECTS_DIR) if os.path.isdir(os.path.join(PROJECTS_DIR, d))]
    return jsonify(projects)

@app.route('/api/create_project', methods=['PUT'])
def create_project():
    data = request.json
    project_name = data.get('project_name')
    if create_project_folder(project_name):
        return jsonify({"message": "Projeto criado com sucesso!"}), 201
    return jsonify({"message": "Projeto já existe ou erro ao criar!"}), 400

@app.route('/api/delete_project', methods=['POST'])
def delete_project():
    data = request.json
    project_name = data.get('project_name')
    if delete_project_folder(project_name):
        return jsonify({"message": "Projeto excluído com sucesso!"}), 200
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/load_code', methods=['GET'])
def load_code():
    project_name = request.args.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            code = f.read()
        return jsonify({"code": code})
    return jsonify({"message": "Código não encontrado!"}), 404

@app.route('/api/save_code', methods=['POST'])
def save_code():
    data = request.json
    project_name = data.get('project_name')
    code = data.get('code')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(project_path):
        with open(file_path, 'w') as f:
            f.write(code)
        return jsonify({"message": "Código salvo com sucesso!"})
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/compile_code', methods=['POST'])
def compile_code():
    project_name = request.json.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        command = [ARDUINO_CLI_PATH, 'compile', '--fqbn', BOARD_FQBN, file_path]
        result = subprocess.run(command, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
        if result.returncode == 0:
            return jsonify({"message": "Compilação concluída com sucesso!", "output": result.stdout})
        else:
            return jsonify({"message": "Erro na compilação.", "error": result.stderr}), 500
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/upload_code', methods=['POST'])
def upload_code():
    project_name = request.json.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        upload_port = detect_arduino_port()
        if upload_port:
            command = [ARDUINO_CLI_PATH, 'upload', '--fqbn', BOARD_FQBN, '-p', upload_port[0], file_path]
            result = subprocess.run(command, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
            if result.returncode == 0:
                return jsonify({"message": "Upload concluído com sucesso!", "output": result.stdout})
            else:
                return jsonify({"message": "Erro no upload.", "error": result.stderr}), 500
        return jsonify({"message": "Porta Arduino não detectada!"}), 404
    return jsonify({"message": "Projeto não encontrado!"}), 404

def detect_arduino_port():
    """Detecta a porta onde o Arduino está conectado."""
    try:
        result = subprocess.run([ARDUINO_CLI_PATH, 'board', 'list'], capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
        if result.returncode == 0:
            ports = []
            for line in result.stdout.splitlines():
                if 'Arduino' in line:
                    port = line.split()[0]
                    ports.append(port)
            return ports
        return None
    except FileNotFoundError:
        return None
    except Exception as e:
        return None

@app.route("/api/portas", methods=["GET"])
def list_ports():
    ports = detect_arduino_port()
    if ports:
        return jsonify({"ports": ports})
    return jsonify({"message": "Porta Arduino não detectada"}), 404
    
#LIB
def run_command(command):
    result = subprocess.run(command, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
    if result.returncode == 0:
        return result.stdout
    return result.stderr

@app.route('/api/available_libraries', methods=['GET'])
def list_available_libraries():
    run_command(['arduino-cli', 'lib', 'update-index'])
    return jsonify({"message": "Atualize o índice para obter bibliotecas disponíveis"}), 200

@app.route('/api/installed_libraries', methods=['GET'])
def list_installed_libraries():
    output = run_command(['arduino-cli', 'lib', 'list'])
    libraries = [line.split()[0] for line in output.splitlines() if line]
    return jsonify({"libraries": libraries})

@app.route('/api/install_library', methods=['POST'])
def install_library():
    data = request.json
    library_name = data.get('library_name')
    output = run_command(['arduino-cli', 'lib', 'install', library_name])
    return jsonify({"message": output})

@app.route('/api/uninstall_library', methods=['POST'])
def uninstall_library():
    data = request.json
    library_name = data.get('library_name')
    output = run_command(['arduino-cli', 'lib', 'uninstall', library_name])
    return jsonify({"message": output})

# Library Viewer
def get_libraries_from_arduino_cli():
    try:
        result = subprocess.run(
            ["arduino-cli", "lib", "search"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True,
            encoding='utf-8',
            creationflags=subprocess.CREATE_NO_WINDOW
        )

        output = result.stdout
        libraries = []
        pattern = re.compile(
            r'Name:\s*(.*?)\n\s*Author:\s*(.*?)\n.*?Category:\s*(.*?)\n.*?Versions:\s*\[(.*?)\]',
            re.DOTALL
        )

        matches = pattern.finditer(output)
        for match in matches:
            name = match.group(1).strip()
            author = match.group(2).strip()
            category = match.group(3).strip()
            versions = match.group(4).strip().split(',')
            last_version = versions[-1].strip() if versions else "N/A"

            libraries.append({
                'Name': name,
                'Author': author,
                'Category': category,
                'LastVersion': last_version
            })

        return libraries

    except Exception as e:
        print(f"Erro ao executar o comando arduino-cli: {e}")
        return []

@app.route('/api/libraries')
def api_libraries():
    libraries = get_libraries_from_arduino_cli()
    return jsonify(libraries)


#if __name__ == '__main__':
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.start()
    
    window = webview.create_window('Wandi Studio 1.0', 'http://127.0.0.1:5000')
    webview.start()

app.run(debug=True)
