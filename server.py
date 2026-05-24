#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/' or path == '':
            self.path = '/static/index.html'
        elif path.startswith('/static/'):
            self.path = path
        elif path.startswith('/css/') or path.startswith('/js/') or path.startswith('/images/'):
            self.path = f'/static{path}'
        
        return super().do_GET()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server():
    server_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(server_dir)
    
    static_path = os.path.join(server_dir, 'static')
    if not os.path.exists(static_path):
        print("❌ ERROR: 'static' folder not found!")
        print("📁 Please create: static/index.html, static/css/, static/js/")
        return
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print("=" * 50)
        print(f"✨ QuickCart Server running at: http://localhost:{PORT}")
        print("🛒 Like Zepto - 10 minute delivery")
        print("=" * 50)
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
