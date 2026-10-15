const { execSync } = require("child_process");
const path = require("path");

module.exports = async function globalSetup() {
  const backendRoot = path.join(__dirname, "..");
  const env = {
    ...process.env,
    DATABASE_URL: "postgresql://planificador:planificador@127.0.0.1:55432/planificador_test",
    NODE_ENV: "test",
  };
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: backendRoot,
    stdio: "inherit",
    env,
  });
  execSync("npx tsx prisma/seed.ts", {
    cwd: backendRoot,
    stdio: "inherit",
    env,
  });
};
