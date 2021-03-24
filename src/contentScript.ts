import {
  getTweetText,
  getTweetUrl,
  getTweetIntentURL,
} from './tweetContent';

const tweet = () => {
  chrome.storage.local.get({ preferShareAPI: false }, async ({ preferShareAPI }) => {
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

const isTargetModal = ((record: MutationRecord) => {
  let flag = false;
  record.addedNodes.forEach(node => {
    if (node.nodeName === 'MODAL' && node instanceof Element && !node.id.endsWith('LOADER') && node.className.includes('modalDialog')) {
      flag = true;
    }
  });
  return flag;
});

(() => {
  /**
   * 各話モーダル表示時にボタンを追加
   */
  const observer = new MutationObserver((mutRecords) => {
    const isModalDisplayed = mutRecords.some(isTargetModal);
    const oldButton = document.getElementById(BUTTON_ID);
    if (isModalDisplayed) {
      if (oldButton) return;
      const button = document.createElement('a');
      const buttonIcon = document.createElement('i');
      button.id = BUTTON_ID;
      Object.assign(button.style, buttonStyle);
      Object.assign(buttonIcon.style, buttonIconStyle);
      button.href = 'javascript:void()';
      button.onclick = tweet;
      button.appendChild(buttonIcon);
      document.querySelector('body').append(button);
    } else {
      if (oldButton && !document.location.search.includes('partId')) oldButton.remove();
    }
  });
  observer.observe(document.querySelector('body'), { childList: true });
})();
