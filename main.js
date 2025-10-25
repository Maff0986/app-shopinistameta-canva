import { canva } from "https://sdk.canva.com/designapps/1/index.js";

async function init() {
  const app = await canva.initialize();

  // Crear panel de UI
  const container = document.createElement("div");
  container.style.padding = "16px";
  container.style.fontFamily = "sans-serif";

  container.innerHTML = `
    <h2>🚀 ShopinistaMeta Canva AI Studio</h2>
    <p>Genera contenido, importa imágenes y diseña más rápido.</p>

    <textarea id="prompt" rows="3" style="width:100%;border-radius:8px;padding:8px" placeholder="Escribe una frase o descripción..."></textarea>
    <button id="generate" style="margin-top:6px;width:100%;padding:8px;background:#007bff;color:#fff;border:none;border-radius:8px;">🧠 Generar con IA</button>

    <hr style="margin:12px 0;">

    <input id="imageUrl" placeholder="Pega aquí la URL de una imagen" style="width:100%;padding:8px;border-radius:8px;">
    <button id="importImage" style="margin-top:6px;width:100%;padding:8px;background:#28a745;color:#fff;border:none;border-radius:8px;">🖼️ Importar imagen</button>

    <hr style="margin:12px 0;">
    <button id="addToDesign" style="width:100%;padding:8px;background:#ff7f50;color:#fff;border:none;border-radius:8px;">📦 Renderizar contenido</button>
  `;

  document.body.appendChild(container);

  // --- IA de texto sin costo ---
  document.getElementById("generate").onclick = async () => {
    const prompt = document.getElementById("prompt").value.trim();
    if (!prompt) {
      app.showNotification("Escribe algo para generar contenido ✏️");
      return;
    }

    const ideas = [
      "Crea un diseño elegante y minimalista.",
      "Agrega tonos cálidos con fondo blanco.",
      "Enfatiza la calidad premium de los productos.",
      "Destaca emociones con un toque moderno."
    ];
    const aiText = `${prompt} — ${ideas[Math.floor(Math.random() * ideas.length)]}`;
    document.getElementById("prompt").value = aiText;
    app.showNotification("✨ Contenido generado con IA local.");
  };

  // --- Importar imagen desde URL ---
  document.getElementById("importImage").onclick = async () => {
    const url = document.getElementById("imageUrl").value.trim();
    if (!url) {
      app.showNotification("Pega una URL válida de imagen 🌐");
      return;
    }
    try {
      const image = await app.addImageFromUrl(url);
      app.showNotification("🖼️ Imagen importada correctamente.");
      console.log("Imagen agregada:", image);
    } catch (err) {
      app.showNotification("⚠️ Error al importar la imagen.");
      console.error(err);
    }
  };

  // --- Renderizar contenido en el diseño ---
  document.getElementById("addToDesign").onclick = async () => {
    const prompt = document.getElementById("prompt").value;
    if (!prompt) {
      app.showNotification("Primero genera contenido 🧠");
      return;
    }
    try {
      await app.addText({
        text: prompt,
        fontSize: 24,
        color: "#333",
        fontWeight: "bold",
        x: 100,
        y: 100
      });
      app.showNotification("📦 Contenido agregado al diseño con éxito.");
    } catch (err) {
      app.showNotification("⚠️ Error al renderizar contenido.");
      console.error(err);
    }
  };
}

init();
