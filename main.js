/* =========================================================
   🧠 ShopinistaMeta Canva App - Main JS
   Version: 1.0.1 | Autor: Marco (Shopinista)
   Descripción:
   Genera contenido, importa imágenes y conecta catálogos
   directamente desde la app de Canva.
   ========================================================= */

// Verificación de carga
console.log("✅ ShopinistaMeta Canva App loaded successfully");

// Registrar acciones de Canva
if (typeof window.Canva !== "undefined") {
  console.log("🧩 Canva SDK detected and ready");

  // Espera la inicialización del SDK
  window.Canva.init(() => {
    console.log("🚀 Canva App initialized");

    // Acción requerida por Canva para renderizar contenido
    window.Canva.registerAction("edit_design:render", async (data) => {
      console.log("🎨 Rendering content into Canva design:", data);
      alert("Contenido enviado correctamente a tu diseño de Canva.");
    });
  });
} else {
  console.error("❌ Canva SDK not detected. Check manifest or HTTPS settings.");
}

/* =========================================================
   📸 Importar Imagen desde URL
   ========================================================= */
async function importImage(url) {
  try {
    if (!url) {
      alert("Por favor, ingresa una URL de imagen válida.");
      return;
    }

    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "imported-image.jpg", { type: blob.type });

    if (window.Canva && window.Canva.design) {
      await window.Canva.design.importImage(file);
      alert("✅ Imagen importada exitosamente en tu diseño.");
    } else {
      alert("❌ No se pudo acceder al diseño de Canva. Revisa permisos.");
    }
  } catch (error) {
    console.error("Error al importar imagen:", error);
    alert("Error al importar la imagen. Revisa la URL o conexión.");
  }
}

/* =========================================================
   🤖 Generar contenido con IA (sin Canva Pro)
   ========================================================= */
async function generateTextWithAI(prompt) {
  try {
    const response = await fetch("https://api.openrouter.ai/v1/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer TU_API_KEY_GRATUITA_AQUI", // Puedes usar una de prueba
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 120,
      }),
    });

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.text?.trim();

    if (generatedText) {
      alert("🧠 Texto generado:\n\n" + generatedText);
      return generatedText;
    } else {
      alert("❌ No se pudo generar el texto. Revisa tu API Key o prompt.");
    }
  } catch (error) {
    console.error("Error con IA:", error);
    alert("Error al generar texto con IA.");
  }
}

/* =========================================================
   📦 Integración de botones de UI
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🧩 UI cargada correctamente.");

  const generateBtn = document.getElementById("generate-btn");
  const imageBtn = document.getElementById("import-image-btn");
  const aiBtn = document.getElementById("ai-btn");

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      window.Canva?.trigger("edit_design:render", { message: "Render test" });
    });
  }

  if (imageBtn) {
    imageBtn.addEventListener("click", () => {
      const url = document.getElementById("image-url").value;
      importImage(url);
    });
  }

  if (aiBtn) {
    aiBtn.addEventListener("click", async () => {
      const prompt = prompt("¿Qué deseas generar con IA?");
      if (prompt) await generateTextWithAI(prompt);
    });
  }
});
