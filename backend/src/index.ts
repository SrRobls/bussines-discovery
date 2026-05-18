import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import ws from "ws";
import { businessesRouter } from "./routes/businesses.js";

// Node.js 20: Supabase Realtime necesita WebSocket (no viene nativo hasta Node 22).
if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/businesses", businessesRouter);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
