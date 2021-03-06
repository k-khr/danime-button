import {
  getTweetText,
  getTweetUrl,
  getTweetIntentURL,
} from './tweetContent';

const tweet = () => {
  chrome.storage.local.get({preferShareAPI: false}, async ({ preferShareAPI }) => {
    if (preferShareAPI) {
      const text = await getTweetText();
      const url = getTweetUrl();
      navigator.share({ text, url });
    } else {
      const url = await getTweetIntentURL();
      window.open(url);
    }
  });
};

// ブラウザツールバーからのハンドリング
chrome.runtime.onMessage.addListener((req, _sender, _sendResp) => {
  if (req._danimebutton == 'DANIME_BUTTON_CLICKED') tweet();
});

//// ページに挿入するボタン
const BUTTON_ID = '_danime_tweetbutton_R9UrVM';
const buttonStyle = {
  width: '60px',
  height: '40px',
  background: '#55acee',
  position: 'fixed',
  top: '1vh',
  right: '1vw',
  zIndex: 2000,
};
const buttonIconStyle = {
  display: 'block',
  background: 'url(/img/sprite.png?20200901) no-repeat',
  backgroundPosition: '-158px 0',
  backgroundSize: '270px 500px',
  width: '25px',
  height: '20px',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
};

const confirmElement = () => new Promise((resolve, _rej) => {
  const intervalID = setInterval(() => {
    const playermodal = document.querySelector('modal');
    if (playermodal) {
      clearInterval(intervalID);
      resolve(playermodal);
    }
  }, 1000);
});

(() => {
  /**
   * 各話モーダル表示時、すなわち ?partId 付きのURL移動時
   * popstate でも onclick でもイベント発生しないため setInterval で URL を監視
   */
  let lastURL = null;
  setInterval(async () => {
    if (lastURL == document.URL) return;
    lastURL = document.URL;
    if (!document.location.search.includes('partId')) {
      const button = document.getElementById(BUTTON_ID);
      if (button) button.remove();
    } else {
      const button = document.createElement('a');
      const buttonIcon = document.createElement('i');
      button.id = BUTTON_ID;
      Object.assign(button.style, buttonStyle);
      Object.assign(buttonIcon.style, buttonIconStyle);
      const playermodal = await confirmElement();
      // button.href = await getTweetIntentURL();
      // button.target = '_blank';
      button.href = '#';
      button.onclick = tweet;
      button.appendChild(buttonIcon);
      document.querySelector('body').append(button);
    }
  }, 300);
})();
