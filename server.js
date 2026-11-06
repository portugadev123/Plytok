import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function isTikTokUrl(value) {
  try {
    const url = new URL(value);
    return ["tiktok.com", "www.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"].includes(url.hostname);
  } catch {
    return false;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "PLYTOK", providerConfigured: Boolean(process.env.DOWNLOADER_API_URL) });
});

app.post("/api/download", async (req, res) => {
  const videoUrl = String(req.body?.url || "").trim();

  if (!videoUrl || !isTikTokUrl(videoUrl)) {
    return res.status(400).json({ error: "Cole um link válido do TikTok." });
  }

  const endpoint = process.env.DOWNLOADER_API_URL;
  if (!endpoint) {
    return res.status(503).json({
      error: "O site está instalado, mas falta configurar o serviço de processamento de vídeos.",
      setup: "Adicione DOWNLOADER_API_URL e a chave da API no arquivo .env. Consulte README.md."
    });
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (process.env.DOWNLOADER_API_KEY) {
      headers[process.env.DOWNLOADER_API_KEY_HEADER || "x-api-key"] = process.env.DOWNLOADER_API_KEY;
    }

    // Ajuste o formato do corpo conforme a documentação do provedor escolhido.
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ url: videoUrl })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(502).json({ error: data.message || "O serviço de download não conseguiu processar esse link." });
    }

    // Formato esperado pelo frontend: { downloadUrl, title?, thumbnail? }
    const downloadUrl = data.downloadUrl || data.download_url || data.video?.noWatermark || data.video?.url;
    if (!downloadUrl) {
      return res.status(502).json({
        error: "A API respondeu, mas não encontramos o link de download. Ajuste o mapeamento em server.js conforme o provedor."
      });
    }

    res.json({
      downloadUrl,
      title: data.title || data.description || "Vídeo do TikTok",
      thumbnail: data.thumbnail || data.cover || ""
    });
  } catch (error) {
    console.error("Downloader provider error:", error);
    res.status(502).json({ error: "Não foi possível conectar ao serviço de download. Tente novamente." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`PLYTOK rodando em http://localhost:${PORT}`));
