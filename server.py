#!/usr/bin/env python3
"""
Groceries Delivery Static Website Server
A simple HTTP server for serving static files
"""

import http.server
import socketserver
import os
import urllib.parse

PORT = 8000
DIRECTORY = "static"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve static files with proper MIME types"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Serve index.html for root path
        if path == '/' or path == '':
            self.path = '/index.html'
        
        # Call parent method to serve file
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Custom log formatting"""
        print(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}")

def run_server():
    """Start the HTTP server"""
    # Change to the static directory
    os.chdir(DIRECTORY)
    
    handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print("🍕 GROCERIES DELIVERY WEBSITE - STATIC SERVER")
        print("=" * 60)
        print(f"✨ Server running at: http://localhost:{PORT}")
        print(f"📁 Serving files from: ./{DIRECTORY}/")
        print(f"🛒 Like Zepto - 10 minute delivery")
        print("-" * 60)
        print("Press Ctrl+C to stop the server")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped successfully")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
