const form = document.querySelector("#downloadForm");
const input = document.querySelector("#videoUrl");
const pasteBtn = document.querySelector("#pasteBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const buttonText = document.querySelector("#buttonText");
const statusBox = document.querySelector("#status");
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector(".topbar nav");

document.querySelector("#year").textContent = new Date().getFullYear();

function showStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

pasteBtn.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.readText) throw new Error("clipboard");
    const text = await navigator.clipboard.readText();
    input.value = text.trim();
    input.focus();
    showStatus("Link colado. Agora é só baixar.");
  } catch {
    input.focus();
    showStatus("Não foi possível acessar a área de transferência. Cole o link manualmente.");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = input.value.trim();
  if (!url) return showStatus("Cole o link de um vídeo do TikTok.", "error");

  downloadBtn.disabled = true;
  buttonText.textContent = "Processando...";
  showStatus("Estamos verificando o link...");

  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível processar o vídeo.");

    const anchor = document.createElement("a");
    anchor.href = data.downloadUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    showStatus("Link de download pronto. Se o download não iniciar, abra o link em uma nova aba.", "success");
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    downloadBtn.disabled = false;
    buttonText.textContent = "Baixar vídeo";
  }
});

menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
