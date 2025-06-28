const form = document.getElementById('confession-form');
const confessionsContainer = document.getElementById('confessions-container');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const confessionText = document.getElementById('confession-text').value;
  if (confessionText.trim() !== '') {
    const response = await fetch('/confesiones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: confessionText })
    });
    const confession = await response.json();
    document.getElementById('confession-text').value = '';
    renderConfessions();
  }
});

async function renderConfessions() {
  const response = await fetch('/confesiones');
  const confesiones = await response.json();
  confessionsContainer.innerHTML = '';
  confesiones.forEach((confession) => {
    const confessionHTML = `
      <div class="bg-gray-800 p-4 rounded shadow-md mb-4">
        <p class="text-lg">${confession.text}</p>
        <p class="text-sm text-gray-400">${confession.timestamp}</p>
      </div>
    `;
    confessionsContainer.insertAdjacentHTML('beforeend', confessionHTML);
  });
}

renderConfessions();
setInterval(renderConfessions, 10000);
