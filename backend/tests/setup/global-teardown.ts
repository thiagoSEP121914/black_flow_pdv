
import { execSync } from 'child_process';
import { logger } from "../../src/utils/logger.js";

export default async () => {
    logger.info('\n🧹 Cleaning up Test Environment...');
    try {
        execSync('docker compose -f docker-compose.test.yml down', { stdio: 'inherit' });
        logger.info('✅ Test Environment stopped.');
    } catch (error) {
        logger.error({ err: error }, '❌ Failed to stop test environment:');
    }
};
