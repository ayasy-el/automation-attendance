import express from "express";
import { tryAbsenForClass } from "./app.js";

export function createWebhookServer() {
  const app = express();
  app.use(express.json());

  app.post("/webhook", async (req, res) => {
    // console.log("[WAHA WEBHOOK] Diterima payload:", req.body);
    if (req.body.event == "message") {
      const sender = req.body.payload.from.split("@")[0];
      const message = req.body.payload.body;

      console.log("[WAHA] from :", sender);
      console.log("[WAHA] Pesan WA :", message);

      const trigger = ["absen", "presensi", "ethol"];
      if (trigger.some((kata) => message.toLowerCase().includes(kata))) await tryAbsenForClass();
    }
    res.json({ ok: true });
  });

  app.get("/", (req, res) => {
    res.json({ status: "ok", service: "waha-webhook", time: new Date().toISOString() });
  });

  return app;
}
