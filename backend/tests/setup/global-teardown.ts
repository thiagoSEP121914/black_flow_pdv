import { execSync } from 'child_process';

export default async () => {
    console.log('\n🧹 Cleaning up Test Environment...');
    try {
        execSync('docker compose -f docker-compose.test.yml down', { stdio: 'inherit' });
        console.log('✅ Test Environment stopped.');
    } catch (error) {
        console.error('❌ Failed to stop test environment:', error);
    }
};
