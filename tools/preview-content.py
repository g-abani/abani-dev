"""Serve the authored HTML snapshots with this checkout's EDS blocks."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import html
import re

ROOT = Path(__file__).resolve().parents[1]


def render(source):
    source = re.search(r'<main><div>(.*)</div></main>', source, re.S).group(1)
    tags = []

    def block(match):
        table = match.group(0)
        name = html.unescape(re.search(r'<th\b[^>]*>(.*?)</th>', table, re.S).group(1))
        rows = re.findall(r'<tr>(.*?)</tr>', re.search(r'<tbody>(.*?)</tbody>', table, re.S).group(1), re.S)
        cells = [re.findall(r'<td>(.*?)</td>', row, re.S) for row in rows]
        if name == 'Metadata':
            for key, value in cells:
                key, value = [html.unescape(re.sub('<[^>]+>', '', item)) for item in (key, value)]
                if key == 'title':
                    tags.append('<title>' + html.escape(value) + '</title>')
                attr, field = ('property', 'og:title') if key == 'title' else ('name', key)
                tags.append(f'<meta {attr}="{field}" content="{html.escape(value, quote=True)}">')
            return ''
        parts = name.lower().split('(', 1)
        classes = parts[0].strip().replace(' ', '-')
        if len(parts) > 1:
            classes += ' ' + parts[1].replace(')', '').replace(',', '')
        return '<div class="' + classes + '">' + ''.join('<div>' + ''.join('<div>' + cell + '</div>' for cell in row) + '</div>' for row in cells) + '</div>'

    sections = []
    for section in source.split('<hr>'):
        styles = []
        def section_meta(match):
            if '<th colspan="2">Section Metadata</th>' not in match.group(0):
                return match.group(0)
            value = re.findall(r'<td>(.*?)</td>', match.group(0), re.S)[1]
            styles.extend(re.sub('<[^>]+>', '', value).replace(',', '').split())
            return ''
        section = re.sub(r'<table>.*?</table>', section_meta, section, flags=re.S)
        section = re.sub(r'<table>.*?</table>', block, section, flags=re.S)
        classes = ' class="' + ' '.join(styles) + '"' if styles else ''
        sections.append('<div' + classes + '>' + section + '</div>')
    sections = ''.join(sections)
    head = (ROOT / 'head.html').read_text()
    return '<!DOCTYPE html><html lang="en"><head>' + head + ''.join(tags) + '</head><body><header></header><main>' + sections + '</main><footer></footer></body></html>'


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0].strip('/') or 'index'
        source = ROOT / 'authoring' / (path.removesuffix('.html') + '.html')
        if source.is_file():
            output = render(source.read_text()).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(output)))
            self.end_headers()
            self.wfile.write(output)
        else:
            super().do_GET()


if __name__ == '__main__':
    print('Portfolio preview: http://localhost:3000', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 3000), Handler).serve_forever()
