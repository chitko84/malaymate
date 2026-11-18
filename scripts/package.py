"""Portable source ZIP, excluding host identity, credentials and dependencies."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
out = root / 'public' / 'MalayMate_Frontend_Project.zip'
folders = ['src', 'server', 'db', 'drizzle', 'public', 'scripts', 'docs']
files = [root / n for n in ['README.md', 'package.json', 'package-lock.json', 'index.html', 'tsconfig.json', 'vite.config.ts', 'drizzle.config.ts', '.gitignore']]
for folder in folders:
    files.extend(p for p in (root / folder).rglob('*') if p.is_file())
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for p in sorted(set(files)):
        if p.suffix == '.zip' or p.name == 'assets.generated.ts' or '__pycache__' in p.parts:
            continue
        archive.write(p, 'MalayMate_Frontend/' + p.relative_to(root).as_posix())
print(out)
