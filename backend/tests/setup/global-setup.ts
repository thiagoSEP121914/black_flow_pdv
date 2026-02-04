
import { execSync } from 'child_process';
import net from 'net';

const waitForPort = (port: number, host: string = 'localhost', timeout: number = 20000): Promise<void> => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const tryConnect = () => {
            const socket = new net.Socket();

            socket.setTimeout(1000);

            socket.on('connect', () => {
                socket.destroy();
                resolve();
            });

            socket.on('timeout', () => {
                socket.destroy();
                checkRetry();
            });

            socket.on('error', () => {
                socket.destroy();
                checkRetry();
            });

            socket.connect(port, host);
        };

        const checkRetry = () => {
            if (Date.now() - startTime >= timeout) {
                reject(new Error(`Timeout waiting for port ${port}`));
            } else {
                setTimeout(tryConnect, 1000);
            }
        };

        tryConnect();
    });
};

export default async () => {
    console.log('\n🚀 Starting Test Environment...');

    try {
        execSync('docker compose -f docker-compose.test.yml up -d', { stdio: 'inherit' });

        // Wait for Mongo to be ready on port 27018
        console.log('⏳ Waiting for MongoDB to be ready...');
        await waitForPort(27018);
        console.log('✅ MongoDB is ready!');

    } catch (error) {
        console.error('❌ Failed to start test environment:', error);
        process.exit(1);
    }
};
