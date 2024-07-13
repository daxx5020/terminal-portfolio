/*
    Root directory
*/

const root = '~';
let cwd = root;


/*
    Define directory place
*/

const user = 'owner';
const server = 'DakshMakwana';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};


/*
    Commands with directories
*/

const directories = {
    education: [
        '',
        '<white>education</white>',

        '* <a href="https://www.glsuniversity.ac.in/" target="_blank" >GLS University</a> <yellow>"MSC (IT)"</yellow> 2022 - 2024',
        '* <a href="https://www.gujaratuniversity.ac.in/" target="_blank" >Gujarat University</a> <yellow>"BSC"</yellow> 2000-2002',
        ''
    ],
    about: [
        '',
        '<white>about me</white>',

        '* Name:<yellow> Daksh Makwana </yellow>',
        '* Date of birth:<yellow> February 16, 2002 </yellow>',
        '* Email:<yellow> dakshmakwna2146@gmail.com </yellow>',
        '* <a href="https://github.com/daxx5020" target="_blank">Github Profile</a>',
        '* <a href="https://www.linkedin.com/in/dakshmakwana" target="_blank" >Linked In Profile</a>',
        ''
    ],
    blog: [
        '',
        '<white>Blog Sites</white>',
        [
            ['Personal Blog',
             'https://webdevcodehub.com/',
            ],
            ['Medium Blog',
            'https://medium.com/@dakshmakwana2146',
            ],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}" target="_blank">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',

        [
            'JavaScript',
            'Python',
            'SQL',
            'PHP',
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        [
            'Laravel',
            'Wordpress',
        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        [
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

/*
    To print directories
*/

function print_dirs() {
    term.echo(dirs.map(dir => {
        return `<blue class="directory">${dir}</blue>`;
    }).join('\n'));
}

/*
    Registered Commands
*/

const commands = {
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                // ls ~ or ls ~/
                print_dirs();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    }
}

const greetings = `  ______                    _             __   ____             __  ____      ___     
 /_  __/__  _________ ___  (_)___  ____ _/ /  / __ \\____  _____/ /_/ __/___  / (_)___ 
  / / / _ \\/ ___/ __ \`__ \\/ / __ \\/ __ \`/ /  / /_/ / __ \\/ ___/ __/ /_/ __ \\/ / / __ \\
 / / /  __/ /  / / / / / / / / / / /_/ / /  / ____/ /_/ / /  / /_/ __/ /_/ / / / /_/ /
/_/  \\___/_/  /_/ /_/ /_/_/_/ /_/\\__,_/_/  /_/    \\____/_/   \\__/_/  \\____/_/_/\\____/`

/*
    Title styling
*/

const font = 'Slant';
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready); // This will load sant statement and call ready function.


/*
    Remove default message
*/

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        // in every function we can use `this` to reference term object
        const cmd = this.get_command();
        // we process the command to extract the command name
        // at the rest of the command (the arguments as one string)
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt
});

/*
    For execute commands
*/

term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command);
});


/*
    To execute directory
*/


term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
});


/*
    Ready function
*/

function ready() {
    term.echo(() => rainbow(render('Terminal Portfolio')))
    .echo('<white>Welcome to my Portfolio <green> Daksh Makwana </red> </green>\n Run ls command for start \n').resume();
}


/*
    Define greetings using figlet
*/

function render(text) {
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true,
    });
}

/*
    Lolcat library function for rainbow color
*/

function rainbow(string) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}


/*
    Creating commands
*/

const formatter = new Intl.ListFormat('en', { //styling the command
    style: 'long',
    type: 'conjunction',
});

const command_list = Object.keys(commands); // Getting the command
const help = formatter.format(command_list);
const formatted_list = command_list.map(cmd => {
    return `<white class="command">${cmd}</white>`;
});

const any_command_re = new RegExp(`^\s*(${command_list.join('|')})`); // Checking white space
$.terminal.new_formatter([any_command_re, '<white>$1</white>']);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white>${command}</white><aqua>${args}</aqua>`;
}]);