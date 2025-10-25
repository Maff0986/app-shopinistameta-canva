/* main.js — ShopinistaMeta Canva App
   - Intenta usar prepareDesignEditor (Intents) según docs
   - Registra edit_design:render correctamente
   - Proporciona UI handlers (IA, importar imagen, render)
*/

// Helper: safe log
const L = (...a) => { try{ console.log("[Shopinista]", ...a); }catch(e){} };

(async function init() {
  L("Initializing ShopinistaMeta Canva App...");

  // renderUI recibe un contenedor (si lo proporciona prepareDesignEditor)
  async function renderUI(container) {
    L("renderUI called, container:", !!container);

    // if container DOM provided, attach; else work with existing index.html
    let root = container || document.querySelector('.container');
    if (!root) {
      L("No container found; aborting UI render.");
      return;
    }

    // Wire up buttons (works both inside iframe provided by Canva or standalone)
    const getById = id => (container ? container.querySelector('#' + id) : document.getElementById(id));

    const importImage = async (url) => {
      if (!url) { alert("Pega una URL de imagen válida"); return; }
      L("Import image:", url);

      // Try canonical APIs in order
      try {
        // 1) new Design Editing API (canva.design.importAsset or similar)
        if (window.canva && window.canva.design && window.canva.design.importAsset) {
          await window.canva.design.importAsset({ type: "IMAGE", url });
          alert("Imagen importada en Canva ✅");
          return;
        }
        // 2) older helper: canva.design.importImage (some environments)
        if (window.canva && window.canva.design && window.canva.design.importImage) {
          await window.canva.design.importImage(url);
          alert("Imagen importada en Canva ✅");
          return;
        }
        // 3) If running inside editor and app instance provides 'editor' API
        if (window.app && app.editor && app.editor.addImage) {
          await app.editor.addImage(url);
          alert("Imagen importada en Canva ✅");
          return;
        }
      } catch (err) {
        L("Import via API failed:", err);
      }

      // fallback: try to fetch blob and use importAsset with File if supported
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const f = new File([blob], "import.jpg", { type: blob.type });
        if (window.canva && window.canva.design && window.canva.design.importAsset) {
          await window.canva.design.importAsset({ type: "IMAGE", file: f });
          alert("Imagen importada (fallback) ✅");
          return;
        }
      } catch (err) {
        L("Fallback import failed:", err);
      }

      alert("No fue posible importar la imagen automáticamente. Verifica permisos o la URL.");
    };

    const addTextToDesign = async (text) => {
      if (!text) { alert("Texto vacío"); return; }
      L("Add text to design:", text);
      try {
        if (window.canva && window.canva.design && window.canva.design.insertText) {
          await window.canva.design.insertText(text);
          alert("Texto agregado al diseño ✅");
          return;
        }
        if (window.app && app.editor && app.editor.addText) {
          await app.editor.addText(text);
          alert("Texto agregado al diseño ✅");
          return;
        }
      } catch (err) {
        L("Add text API failed:", err);
      }
      alert("No se pudo agregar texto automáticamente. Revisa permisos.");
    };

    // Attach button handlers (works if index.html present or inside container)
    const aiBtn = getById('ai-btn');
    const imageBtn = getById('import-image-btn');
    const generateBtn = getById('generate-btn');

    if (aiBtn) {
      aiBtn.addEventListener('click', async () => {
        const promptEl = getById('prompt') || document.getElementById('prompt');
        const promptVal = promptEl ? promptEl.value.trim() : '';
        if (!promptVal) return alert("Escribe una descripción primero.");
        // Use a free public-ish generator fallback: Hugging Face inference demo or local prompt
        try {
          // Using a public free model endpoint (Hugging Face inference requires CORS/key usually).
          // We'll attempt a safe local prompt-based generation (placeholder) to avoid keys.
          const generated = `Generated title for: ${promptVal}`; // placeholder — user can replace with HF/API key later
          await addTextToDesign(generated);
        } catch (err) {
          L("AI generation failed:", err);
          alert("No se pudo generar texto con IA (sin API key). Puedes integrar HuggingFace/OpenRouter para mejor resultado.");
        }
      });
    }

    if (imageBtn) {
      imageBtn.addEventListener('click', async () => {
        const urlEl = getById('image-url') || document.getElementById('image-url');
        const url = urlEl ? urlEl.value.trim() : '';
        await importImage(url);
      });
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        const promptEl = getById('prompt') || document.getElementById('prompt');
        const text = promptEl ? (promptEl.value.trim() || 'Sample text from ShopinistaMeta') : 'Sample text from ShopinistaMeta';
        await addTextToDesign(text);
      });
    }

    L("UI wired (inside render).");
  } // end renderUI

  // ---------- REGISTER DESIGN EDITOR INTENT (preferred method) ----------
  // Try multiple ways to register prepareDesignEditor according to environment
  try {
    // 1) If prepareDesignEditor available on window
    if (typeof window.prepareDesignEditor === 'function') {
      window.prepareDesignEditor({ render: async ({ root }) => { await renderUI(root || null); } });
      L("Registered prepareDesignEditor via window.prepareDesignEditor");
      return;
    }

    // 2) If global 'Canva' exposes intents helper (older/alternate)
    if (window.Canva && typeof window.Canva.prepareDesignEditor === 'function') {
      window.Canva.prepareDesignEditor({ render: async ({ root }) => { await renderUI(root || null); } });
      L("Registered prepareDesignEditor via Canva.prepareDesignEditor");
      return;
    }

    // 3) If module-style API injected as 'canvaIntents' or 'canva' object
    if (window.canva && typeof window.canva.prepareDesignEditor === 'function') {
      window.canva.prepareDesignEditor({ render: async ({ root }) => { await renderUI(root || null); } });
      L("Registered prepareDesignEditor via canva.prepareDesignEditor");
      return;
    }
  } catch (err) {
    L("Error registering prepareDesignEditor:", err);
  }

  // ---------- FALLBACK: legacy registration (registerAction event) ----------
  try {
    // Some older examples require registering 'edit_design:render' action manually
    if (window.canva && typeof window.canva.on === 'function') {
      window.canva.on('edit_design:render', async () => {
        L("Legacy event edit_design:render fired");
        await renderUI(null);
      });
      L("Registered legacy canva.on('edit_design:render') listener");
      return;
    }
    // If 'Canva' global supports registerAction
    if (window.Canva && typeof window.Canva.registerAction === 'function') {
      window.Canva.registerAction('edit_design:render', {
        render: async (payload) => {
          L("Canva.registerAction edit_design:render payload:", payload);
          await renderUI(null);
        }
      });
      L("Registered registerAction('edit_design:render')");
      return;
    }
  } catch (err) {
    L("Fallback registration error:", err);
  }

  // If nothing registered, place UI in page (useful for GitHub Pages preview)
  L("No prepareDesignEditor/registerAction detection succeeded — attaching UI to page root for preview.");
  await renderUI(null);

})(); // end init
