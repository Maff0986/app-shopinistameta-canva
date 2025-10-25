// =============================
// 🎨 ShopinistaMeta Canva App
// =============================

(async () => {
  // Inicializar Canva SDK
  const app = await window.canva.init();
  console.log("✅ Canva SDK conectado correctamente.");

  // Registrar acción requerida para Canva
  app.registerAction("edit_design:render", {
    async execute() {
      console.log("Render action ejecutada correctamente");
    },
  });

  // =============================
  // 🧠 Generar contenido con IA
  // =============================
  document.getElementById("ai-btn").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value.trim();
    if (!prompt) return alert("Por favor escribe una descripción primero.");

    try {
      const response = await fetch("https://api.monkebrain.ai/text/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const text = data.output || "No se generó contenido.";
      await app.editor.addText(text);

      alert("✅ Contenido generado y agregado al diseño.");
    } catch (err) {
      console.error("Error al generar contenido:", err);
      alert("❌ No se pudo generar el contenido.");
    }
  });

  // =============================
  // 🖼️ Importar imagen desde URL
  // =============================
  document.getElementById("import-image-btn").addEventListener("click", async () => {
    const imageUrl = document.getElementById("image-url").value.trim();
    if (!imageUrl) return alert("Pega la URL de una imagen.");

    try {
      await app.editor.addImage(imageUrl);
      alert("✅ Imagen importada correctamente.");
    } catch (err) {
      console.error("Error al importar imagen:", err);
      alert("❌ Error al importar la imagen.");
    }
  });

  // =============================
  // 📦 Agregar al diseño (render)
  // =============================
  document.getElementById("generate-btn").addEventListener("click", async () => {
    try {
      await app.editor.addText("✨ Render agregado con éxito desde ShopinistaMeta!");
      console.log("✅ Render agregado.");
    } catch (err) {
      console.error("Error al renderizar:", err);
    }
  });
})();
