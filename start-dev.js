import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m"
};

function startProcess(name, command, args, cwd, color) {
    console.log(`${color}[${name}] Starting...${colors.reset}`);

    // Use shell: true for Windows compatibility with npm
    const proc = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: 'true' }
    });

    proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) console.log(`${color}[${name}] ${line.trim()}${colors.reset}`);
        });
    });

    proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) console.error(`${colors.red}[${name} ERROR] ${line.trim()}${colors.reset}`);
        });
    });

    proc.on('close', (code) => {
        console.log(`${color}[${name}] Exited with code ${code}${colors.reset}`);
    });

    return proc;
}

// Iniciar Backend (en carpeta Servidor)
const backend = startProcess('BACKEND', 'npm', ['run', 'dev'], path.join(__dirname, 'Servidor'), colors.blue);

// Iniciar Frontend (en raíz)
const frontend = startProcess('FRONTEND', 'npm', ['run', 'dev'], __dirname, colors.green);

process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit();
});
