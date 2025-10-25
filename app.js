import { registerApp, fetchDesign, uploadImage, showNotification } from '@canva/design';
import Papa from 'papaparse';

registerApp({
  render: async ({ context }) => {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.fontFamily = 'sans-serif';

    const title = document.createElement('h2');
    title.textContent = '📊 Import Data into Canva';
    container.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Paste public Google Sheets CSV URL or upload CSV';
    input.style.width = '100%';
    input.style.marginBottom = '10px';
    container.appendChild(input);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.marginBottom = '10px';
    container.appendChild(fileInput);

    const button = document.createElement('button');
    button.textContent = 'Import Data';
    button.style.padding = '10px';
    button.style.backgroundColor = '#00c4cc';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    container.appendChild(button);

    const result = document.createElement('pre');
    result.style.marginTop = '20px';
    result.style.whiteSpace = 'pre-wrap';
    container.appendChild(result);

    button.onclick = async () => {
      result.textContent = 'Loading...';
      let csvText = '';

      try {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          csvText = await file.text();
        } else if (input.value.startsWith('http')) {
          const response = await fetch(input.value);
          csvText = await response.text();
        } else {
          showNotification({ message: 'Please provide a valid CSV URL or upload a file.' });
          return;
        }

        const parsed = Papa.parse(csvText, { header: true });
        const rows = parsed.data;

        result.textContent = JSON.stringify(rows, null, 2);
        showNotification({ message: `Imported ${rows.length} rows successfully.` });
      } catch (error) {
        result.textContent = 'Error importing data.';
        showNotification({ message: 'Failed to import data.' });
        console.error(error);
      }
    };

    return container;
  }
});
