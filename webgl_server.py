import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer
from threading import Thread
from rich.console import Console
from rich import print

# Inicializar o rich console
console = Console()

class GzipRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith('.gz'):
            self.send_header('Content-Encoding', 'gzip')
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if path.endswith('.js.gz'):
            with open(path, 'rb') as f:
                content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript')
                self.end_headers()
                self.wfile.write(content)
        elif path.endswith('.wasm.gz'):
            with open(path, 'rb') as f:
                content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/wasm')
                self.end_headers()
                self.wfile.write(content)
        elif path.endswith('.gz'):
            with open(path, 'rb') as f:
                content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', self.guess_type(path))
                self.end_headers()
                self.wfile.write(content)
        else:
            super().do_GET()

def get_path(relative_path):
    """Obtém o caminho absoluto relativo ao local do executável."""
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(__file__)
    return os.path.join(base_path, relative_path)

def serve_webgl(port: int, directory: str):
    directory = get_path(directory)
    os.chdir(directory)
    console.print(f"[bold blue]Unity3D WebGL Server iniciado na porta {port}...[/bold blue]")
    httpd = HTTPServer(('localhost', port), GzipRequestHandler)
    httpd.serve_forever()

def start_webgl_server(port: int, directory: str):
    webgl_thread = Thread(target=serve_webgl, args=(port, directory))
    webgl_thread.start()
