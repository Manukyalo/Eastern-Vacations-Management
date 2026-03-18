const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const map = {
    'bg-slate-50': 'dark:bg-[#0f172a]', // Darker slate
    'bg-slate-100': 'dark:bg-[#1e293b]', // Lighter slate
    'bg-white/50': 'dark:bg-white/5',
    'bg-white/80': 'dark:bg-white/10',
    'bg-white': 'dark:bg-[#1e293b]',
    'border-slate-200': 'dark:border-white/5',
    'border-slate-300': 'dark:border-white/10',
    'text-slate-900': 'dark:text-white',
    'text-slate-700': 'dark:text-slate-200',
    'text-slate-600': 'dark:text-slate-300',
    'text-slate-500': 'dark:text-slate-400',
};

function processFile(filePath) {
    if (path.extname(filePath) !== '.jsx' && path.extname(filePath) !== '.js') return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const [light, dark] of Object.entries(map)) {
        // Match the light class, ensuring it's not part of another word, 
        // and ensuring it's not already followed by the dark class.
        // We use split and join on className strings if possible, but regex is easier.
        const regexStr = `(?<!-)\\b${light.replace(/\//g, '\\/')}\\b(?!\\s+${dark.replace(/\//g, '\\/')})`;
        const regex = new RegExp(regexStr, 'g');
        content = content.replace(regex, `${light} ${dark}`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated for Dark Mode: ${filePath}`);
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

traverseDirectory(directoryPath);
console.log('Dark mode class injection complete.');
