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
        '* <a href="https://www.glsuniversity.ac.in/" target="_blank">GLS University</a> <yellow>"MSC (IT)"</yellow> 2022 - 2024',
        '* <a href="https://www.gujaratuniversity.ac.in/" target="_blank">Gujarat University</a> <yellow>"BSC"</yellow> 2019 - 2022',
        ''
    ],
    about: [
        '',
        '<white>about me</white>',
        '* Name: <yellow>Daksh Makwana</yellow>',
        '* Date of birth: <yellow>February 16, 2002</yellow>',
        '* Email: <yellow>dakshmakwna2146@gmail.com</yellow>',
        '* <a href="https://github.com/daxx5020" target="_blank">Github Profile</a>',
        '* <a href="https://www.linkedin.com/in/dakshmakwana" target="_blank">LinkedIn Profile</a>',
        ''
    ],
    blog: [
        '',
        '<white>Blog Sites</white>',
        [
            ['Personal Blog', 'https://webdevcodehub.com/'],
            ['Medium Blog', 'https://medium.com/@dakshmakwana2146'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}" target="_blank">${name}</a> — <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',
        ['JavaScript', 'Python', 'SQL', 'PHP'].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        ['Laravel', 'Wordpress'].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        ['git', 'GNU/Linux'].map(lib => `* <blue>${lib}</blue>`),
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
};

/*
    Remove default message and display welcome message
*/

const term = $('body').terminal(commands, {
    greetings: [
        '<white>Welcome to my Portfolio <green>Daksh Makwana</green></white>',
        'Run <white>ls</white> command to start\n'
    ].join('\n'),
    checkArity: false,
    formatters: false, // Disable formatters for input
    completion(string) {
        const cmd = this.get_command();
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
    Creating commands
*/

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

const command_list = Object.keys(commands);
const help = formatter.format(command_list);
const formatted_list = command_list.map(cmd => {
    return `<white class="command">${cmd}</white>`;
});

// Apply formatter only to output
term.formatters = [
    [new RegExp(`^\\s*(${command_list.join('|')})\\s*(.*)`), function(_, command, args) {
        return `<white>${command}</white><aqua>${args}</aqua>`;
    }]
];