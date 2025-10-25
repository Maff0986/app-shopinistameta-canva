// Canva SDK (no requiere instalación)
const canva = window.canva;

document.getElementById('generateBtn').addEventListener('click', async () => {
  const text = document.getElementById('prompt').value;
  if (!text) return alert('Escribe algo primero');

  await canva.design.addText({
    text: text,
    fontSize: 24,
    color: '#222',
    position: { x: 100, y: 100 }
  });
});

document.getElementById('importBtn').addEventListener('click', async () => {
  const imageUrl = document.getElementById('imageUrl').value;
  if (!imageUrl) return alert('Pega la URL de la imagen');
  
  await canva.design.addImage({
    url: imageUrl,
    position: { x: 150, y: 150 },
    width: 400
  });
});

document.getElementById('loadCsvBtn').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert('Selecciona un archivo CSV');
  
  const text = await file.text();
  const rows = text.split('\n').slice(1);
  
  for (const row of rows) {
    const [title, imageUrl] = row.split(',');
    if (imageUrl) {
      await canva.design.addImage({ url: imageUrl.trim(), width: 400 });
      await canva.design.addText({ text: title.trim(), fontSize: 20, color: '#000' });
    }
  }
});
