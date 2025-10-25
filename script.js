// Espera a que Canva esté listo
window.onload = () => {
  const generateBtn = document.getElementById('generateBtn');
  const importBtn = document.getElementById('importBtn');
  const textInput = document.getElementById('textInput');
  const imageUrl = document.getElementById('imageUrl');
  const fileInput = document.getElementById('fileInput');

  // Agregar texto al lienzo
  generateBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return alert('Escribe un texto primero.');

    await window.canva.design.insertText(text);
    alert('Texto agregado al diseño.');
    textInput.value = '';
  });

  // Importar imagen desde URL
  importBtn.addEventListener('click', async () => {
    const url = imageUrl.value.trim();
    if (!url) return alert('Ingresa una URL válida.');
    try {
      await window.canva.design.importAsset({
        type: 'IMAGE',
        url: url
      });
      alert('Imagen importada correctamente.');
      imageUrl.value = '';
    } catch (error) {
      console.error(error);
      alert('Error al importar imagen.');
    }
  });

  // Leer archivo CSV o JSON (feeds o catálogos)
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        console.log('Datos JSON cargados:', data);
        alert('Archivo JSON cargado correctamente.');
      } else if (file.name.endsWith('.csv')) {
        console.log('Contenido CSV:\n', text);
        alert('Archivo CSV cargado correctamente.');
      }
    } catch (error) {
      alert('Error al leer el archivo.');
    }
  });
};
