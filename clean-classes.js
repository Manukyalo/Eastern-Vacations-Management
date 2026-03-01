const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const exactReplacements = {
    'bg-white dark:bg-[#1e293b]/50 dark:bg-white dark:bg-[#1e293b]/5': 'bg-white/50 dark:bg-white/5',
    'bg-white dark:bg-[#1e293b]/80 dark:bg-white dark:bg-[#1e293b]/10': 'bg-white/80 dark:bg-white/10',
    'bg-white dark:bg-[#1e293b]/10 dark:bg-white dark:bg-[#1e293b]/10': 'bg-white/10 dark:bg-white/10', // Just in case
    'bg-white dark:bg-[#1e293b]/20 dark:bg-white dark:bg-[#1e293b]/20': 'bg-white/20 dark:bg-white/20'
};

function processFile(filePath) {
    if (path.extname(filePath) !== '.jsx' && path.extname(filePath) !== '.js') return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const [bad, good] of Object.entries(exactReplacements)) {
        content = content.split(bad).join(good);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned: ${filePath}`);
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
console.log('Cleanup script finished.');
