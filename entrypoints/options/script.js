import { storage } from 'wxt/storage';

function save() {
  storage.setItem('local:api_key', document.getElementById('gemini-api-key').value);
  storage.setItem('local:custom_prompt', document.getElementById('custom-prompt').value);

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
  storage.getItem('local:custom_prompt').then((item) => {
    document.getElementById('custom-prompt').value = item ?? '';
  });
}

document.addEventListener('DOMContentLoaded', load);
document.getElementById('save_button').addEventListener('click', save);