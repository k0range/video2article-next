import { storage } from 'wxt/storage';

function save() {
  storage.setItem('local:api_key', document.getElementById('gemini-api-key').value);
  storage.setItem('local:custom_prompt', document.getElementById('custom-prompt').value);
  storage.setItem('local:includes_image', JSON.parse(document.getElementById('includes-image').value));

  document.getElementById('save_button').textContent = '保存しました！';
  document.getElementById('save_button').classList.add('saved');
  setTimeout(() => {
    document.getElementById('save_button').textContent = '保存';
    document.getElementById('save_button').classList.remove('saved');
  }, 1800);
}

function load() {
  storage.getItem('local:api_key').then((item) => {
    document.getElementById('gemini-api-key').value = item ?? '';
  });
  storage.getItem('local:includes_image').then((item) => {
    document.getElementById('includes-image').value = item ?? 'true';
  });
  storage.getItem('local:custom_prompt').then((item) => {
    document.getElementById('custom-prompt').value = item ?? '';
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  load();

  let creations = await (await fetch('https://korange.work/creations.json')).json();
  creations = creations.ads.filter((creation) => creation.id !== 'video2article-next');

  let creationsWithPriority = [];
  for ( const creation of creations ) {
    for ( let i = 0; i < creation.priority; i++ ) {
      creationsWithPriority.push(creation);
    }
  }

  const pickedCreation = creationsWithPriority[Math.floor(Math.random() * creationsWithPriority.length)];

  const ad = document.getElementById('ad');
  ad.querySelector('#name').textContent = pickedCreation.name;
  ad.querySelector('#description').textContent = pickedCreation.description;
  ad.querySelector('#button').href = pickedCreation.url;
  ad.querySelector('#image').src = pickedCreation.icon;
  ad.style.display = 'block';
});
document.getElementById('save_button').addEventListener('click', save);