/// <reference types="node" />
import { execSync } from 'child_process';

const isIntegrationTest = (): boolean => {
    const testMatch = process.argv.find((arg: string) => arg.includes('int.spec'));
    const envFlag = process.env.INTEGRATION_TEST === 'true';
    return !!testMatch || envFlag;
};

export default async () => {
    // Só para Docker para testes de integração
    if (!isIntegrationTest()) {
        return;
    }

    console.log('\n🧹 Cleaning up Test Environment...');
    try {
        execSync('docker compose -f docker-compose.test.yml down', { stdio: 'inherit' });
        console.log('✅ Test Environment stopped.');
    } catch (error) {
        console.error('❌ Failed to stop test environment:', error);
    }
};
