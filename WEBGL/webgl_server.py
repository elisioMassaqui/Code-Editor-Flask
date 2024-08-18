from http.server import SimpleHTTPRequestHandler, HTTPServer
from threading import Thread
import os

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

def serve_webgl(port: int, directory: str):
    os.chdir(directory)
    httpd = HTTPServer(('localhost', port), GzipRequestHandler)
    print(f"Serving WebGL at http://localhost:{port}")
    httpd.serve_forever()

def start_webgl_server(port: int, directory: str):
    webgl_thread = Thread(target=serve_webgl, args=(port, directory))
    webgl_thread.start()
