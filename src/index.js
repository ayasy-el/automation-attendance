import "dotenv/config";
import process from "node:process";
import { appInit, appKickoff, appShutdown } from "./app.js";
import { createWebhookServer } from "./webhook.js";

async function bootstrap() {
  const app = createWebhookServer();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`[SERVER] Webhook listening on port ${PORT}`));

  await appInit();
  await appKickoff();
}

function shutdown() {
  appShutdown();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap().catch((err) => {
  console.error("[FATAL] Bootstrap:", err);
  process.exit(1);
});
