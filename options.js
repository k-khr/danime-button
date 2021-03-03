'use strict';

const CHANGE_NOTIF_BGCOLOR = '#aeac';
const RESET_NOTIF_BGCOLOR = '#eeec';
const NOTIFICATION_TIME = 3000;

function showNotification(message, bgcolor=null) {
  const notificationEl = document.getElementById('notification');
  notificationEl.textContent = message;
  notificationEl.style.display = 'block';
  if (bgcolor) notificationEl.style.backgroundColor = bgcolor;
  setTimeout(()=>{notificationEl.style.display = 'none'}, NOTIFICATION_TIME);
}
function saveSettings() {
  const tweetContent = document.getElementById("tweetcontent").value;
  if (tweetContent) chrome.storage.local.set({ tweetContent });
  showNotification('設定を保存しました。', CHANGE_NOTIF_BGCOLOR);
}
function resetSettings() {
  chrome.storage.local.set({ tweetContent: null });
  showNotification('設定をリセットしました。再読み込みしてください。', RESET_NOTIF_BGCOLOR);
}
document.getElementById('applyButton').addEventListener('click', saveSettings);
document.getElementById('resetButton').addEventListener('click', resetSettings);
//
(() => {
  chrome.storage.local.get('tweetContent', (res) => {
    if (res && 'tweetContent' in res) {
      document.getElementById("tweetcontent").value = res['tweetContent'];
    }
  });
})();
