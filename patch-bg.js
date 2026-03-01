const fs = require('fs');
const path = require('path');

const replacements = [
    { search: 'hover:bg-slate-100', replace: 'hover:bg-slate-100 dark:hover:bg-[#1e293b]' },
    { search: 'hover:bg-slate-200', replace: 'hover:bg-slate-200 dark:hover:bg-slate-800' },
    { search: 'hover:bg-slate-300', replace: 'hover:bg-slate-300 dark:hover:bg-slate-700' },
    { search: 'bg-slate-100', replace: 'bg-slate-100 dark:bg-[#1e293b]' },
    { search: 'bg-slate-200', replace: 'bg-slate-200 dark:bg-slate-800' },
    { search: 'bg-slate-300', replace: 'bg-slate-300 dark:bg-slate-700' },
    { search: 'bg-slate-400', replace: 'bg-slate-400 dark:bg-slate-600' }
];

function processFile(filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const { search, replace } of replacements) {
        // Regex to find 'search' that is NOT followed by ' dark:' or NOT preceded by 'dark:'
        // For example: hover:bg-slate-100 (but skip if hover:bg-slate-100 dark:hover:bg-[#1e293b])
        // Since JS has limited lookbehind, we just split and join carefully, or use a simpler regex.

        const regex = new RegExp(`(?<!dark:)${search}(?!\\s+dark:)`, 'g');
        content = content.replace(regex, replace);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Patched: ' + filePath);
    }
}

function traverseDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else {
            processFile(fullPath);
        }
    });
}

traverseDirectory(path.join(__dirname, 'src'));
