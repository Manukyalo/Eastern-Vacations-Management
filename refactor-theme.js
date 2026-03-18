const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

// Comprehensive mapping of dark mode classes to light mode equivalents
const replacements = {
    // Backgrounds
    'bg-dark-900': 'bg-white',
    'bg-dark-800': 'bg-slate-50',
    'bg-dark-700': 'bg-slate-100',
    'bg-white/5': 'bg-slate-100',
    'bg-white/10': 'bg-slate-200',
    'bg-white/20': 'bg-slate-300',

    // Text Colors
    'text-white': 'text-slate-900', // Note: Needs careful review inside primary buttons
    'text-dark-200': 'text-slate-700',
    'text-dark-300': 'text-slate-600',
    'text-dark-400': 'text-slate-500',

    // Borders
    'border-white/5': 'border-slate-200',
    'border-white/10': 'border-slate-300',
    'border-white/20': 'border-slate-300',
};

// Exceptional generic text-white cases inside brand-colored elements
// We'll revert text-slate-900 back to text-white if it's found near `from-primary-` or generic buttons
const safeButtonKeywords = [
    'from-primary-',
    'bg-emerald-',
    'bg-red-',
    'bg-orange-',
    'bg-blue-',
    'bg-indigo-',
    'bg-green-',
    'bg-purple-'
];

function processFile(filePath) {
    if (path.extname(filePath) !== '.jsx' && path.extname(filePath) !== '.js') return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Apply exact replacements
    for (const [darkClass, lightClass] of Object.entries(replacements)) {
        // Use word boundary for exact matches
        // e.g. don't replace bg-dark-900/50 randomly unless handled
        const regex = new RegExp(`(?<!-)\\b${darkClass}\\b(?![/-])`, 'g');
        content = content.replace(regex, lightClass);

        // Handle common opacity modifiers
        content = content.replace(new RegExp(`(?<!-)\\b${darkClass}/50\\b`, 'g'), `${lightClass}/50`);
        content = content.replace(new RegExp(`(?<!-)\\b${darkClass}/80\\b`, 'g'), `${lightClass}/80`);
        content = content.replace(new RegExp(`(?<!-)\\b${darkClass}/90\\b`, 'g'), `${lightClass}/90`);
        content = content.replace(new RegExp(`(?<!-)\\b${darkClass}/95\\b`, 'g'), `${lightClass}/95`);
    }

    // Heuristics: Revert text-slate-900 back to text-white if inside elements with colored backgrounds
    // This is simple line-by-line check. If a line has a strong bg color and text-slate-900, flip it back.
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('text-slate-900')) {
            const hasDarkBg = safeButtonKeywords.some(kw => line.includes(kw));
            if (hasDarkBg) {
                // Keep the text white for contrast on colored buttons
                lines[i] = line.replace(/text-slate-900/g, 'text-white');
            }
        }
    }
    content = lines.join('\n');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
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
console.log('Migration complete.');
