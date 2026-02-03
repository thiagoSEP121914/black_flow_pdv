import { execSync } from "child_process";

const waitForReplicaSet = (timeout: number = 60000): Promise<void> => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkReplicaSet = () => {
            try {
                // Check if replica set is initialized and ready
                const result = execSync('docker exec backend-mongo_test-1 mongosh --quiet --eval "rs.status().ok"', {
                    encoding: "utf-8",
                    timeout: 5000,
                }).trim();

                if (result === "1") {
                    resolve();

                    return;
                }
            } catch {
                // Replica set not ready yet, try to initialize it
                try {
                    execSync(
                        "docker exec backend-mongo_test-1 mongosh --quiet --eval \"rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})\"",
                        { encoding: "utf-8", timeout: 5000 },
                    );
                } catch {
                    // Ignore - might already be initiated or not ready
                }
            }

            if (Date.now() - startTime >= timeout) {
                reject(new Error("Timeout waiting for MongoDB replica set"));
            } else {
                setTimeout(checkReplicaSet, 1000);
            }
        };

        // Give MongoDB a moment to start before checking
        setTimeout(checkReplicaSet, 2000);
    });
};

export default async () => {
    console.log("\n🚀 Starting Test Environment...");

    try {
        execSync("docker compose -f docker-compose.test.yml up -d", { stdio: "inherit" });

        // Wait for Mongo replica set to be ready
        console.log("⏳ Waiting for MongoDB replica set to be ready...");
        await waitForReplicaSet();
        console.log("✅ MongoDB replica set is ready!");
    } catch (error) {
        console.error("❌ Failed to start test environment:", error);
        process.exit(1);
    }
};
