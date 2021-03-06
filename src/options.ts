import { DEFAULT_TWEET_TEXT } from './tweetContent';

const CHANGE_NOTIF_BGCOLOR = '#aea';
const RESET_NOTIF_BGCOLOR = '#eee';
const NOTIFICATION_TIME = 3000;

const SETTINGS_KEYS = ['tweetContent', 'preferShareAPI'];

let lastTimeout = null;

function showNotification(message, bgcolor=null) {
  const notificationEl = document.getElementById('notification');
  notificationEl.textContent = message;
  notificationEl.style.display = 'block';
  if (bgcolor) notificationEl.style.backgroundColor = bgcolor;
  if (lastTimeout) clearTimeout(lastTimeout);
  lastTimeout = setTimeout(()=>{notificationEl.style.display = 'none'}, NOTIFICATION_TIME);
}
function saveSettings() {
  SETTINGS_KEYS.forEach((key)=>{
    const el = document.getElementById(key) as HTMLInputElement;
    let value = (el.type === 'checkbox') ? el.checked : el.value;
    chrome.storage.local.set({[key]: value});
  });
  showNotification('設定を保存しました。', CHANGE_NOTIF_BGCOLOR);
}
function resetSettings() {
  SETTINGS_KEYS.forEach((key)=>{
    chrome.storage.local.set({[key]: null});
  });
  showNotification('設定をリセットしました。再読み込みしてください。', RESET_NOTIF_BGCOLOR);
}
document.getElementById('applyButton').addEventListener('click', saveSettings);
document.getElementById('resetButton').addEventListener('click', resetSettings);

//
function setSavedSettings(name) {
  chrome.storage.local.get(name, (res) => {
    if (res && name in res) {
      let inputEl = document.getElementById(name) as HTMLInputElement;
      inputEl.value = res[name];
      if (inputEl.type === 'checkbox') inputEl.checked = res[name];
    }
  })
}
//
(() => {
  SETTINGS_KEYS.forEach((el)=>{ setSavedSettings(el) });
  // initialize
  if ('share' in navigator) {
    (document.getElementById('tweetContent') as HTMLInputElement).placeholder = DEFAULT_TWEET_TEXT;
    document.getElementById('preferShareAPI').removeAttribute('disabled');
  }
})();
