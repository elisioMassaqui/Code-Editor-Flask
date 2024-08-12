import webbrowser
import webview
import threading
import subprocess

def start_flask_app():
    subprocess.Popen(['python', 'app.py'])

def open_nova_funcionalidade():
    webbrowser.open("http://127.0.0.1:5000/index.html")

if __name__ == '__main__':
    # Iniciar o servidor Flask em uma thread separada
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.start()

    # Abrir o menu inicial com pywebview (hero.html)
    window = webview.create_window('Menu Inicial', 'http://127.0.0.1:5000/')
    webview.start()

    # Abrir a nova funcionalidade (index.html) no navegador padrão
    open_nova_funcionalidade()
