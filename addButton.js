'use strict';

/**
 * tweet contents
 */
const TITLE_PLACEHOLDER = '%title%';
const EPISODENUMBER_PLACEHOLDER = '%episodeNumber%';
const EPISODETITLE_PLACEHOLDER = '%episodeTitle%';

const DEFAULT_TWEET_TEXT = `${TITLE_PLACEHOLDER} ${EPISODENUMBER_PLACEHOLDER}を視聴しました！ #dアニメストア`;

const getTitle = () => document.querySelector('.headerText').textContent;
const getEpisodeNumber = () => {
  return document.querySelector('.episodeTitle .number').textContent;
}
const getEpispodeTitle = () => {
  return document.querySelector('.episodeTitle .title').textContent;
}
const getTweetUrl = () => encodeURIComponent(document.URL);

const getTweetText = async () => {
  const tweetText = await new Promise((resolve, _rej) => {
    chrome.storage.local.get('tweetContent', (res) => {
      if (res && 'tweetContent' in res) resolve(res.tweetContent);
      resolve();
    });
  }) || DEFAULT_TWEET_TEXT;

  return encodeURIComponent(
    tweetText
      .replace(TITLE_PLACEHOLDER, getTitle())
      .replace(EPISODENUMBER_PLACEHOLDER, getEpisodeNumber())
      .replace(EPISODETITLE_PLACEHOLDER, getEpispodeTitle())
  );
};


/**
 * style of tweet button
 */
const buttonStyle = {
  width: '75px',
  height: '30px',
  background: '#55acee',
  position: 'relative',
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
const spacerStyle = {
  flexBasis: '10px',
}

const confirmElement = () => new Promise((resolve, _rej) => {
  const intervalID = setInterval(() => {
    const playermodal = document.querySelector('.moviePlayerModal');
    if (playermodal) {
      clearInterval(intervalID);
      resolve(playermodal);
    }
  }, 1000);
});

/**
 * content_script 
 */
(() => {
  /**
   * 各話モーダル表示時、すなわち ?partId 付きのURL移動時
   * popstate でも onclick でもイベント発生しないため setInterval で URL を監視
   */
  let lastURL = document.URL;
  setInterval(async () => {
    if (lastURL == document.URL) return;
    lastURL = document.URL;
    if (!document.location.search.includes('partId')) return;
    const button = document.createElement('a');
    const buttonIcon = document.createElement('i');
    const spacer = document.createElement('span');
    Object.assign(button.style, buttonStyle);
    Object.assign(buttonIcon.style, buttonIconStyle);
    Object.assign(spacer.style, spacerStyle);
    const playermodal = await confirmElement();
    const tweetText = await getTweetText();
    const tweetUrl = getTweetUrl();
    button.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    button.target = '_blank';
    button.appendChild(buttonIcon);
    document.querySelector('.modalBodyWrapper .animeePageBtn').prepend(button, spacer);
    playermodal.style.overflow = 'scroll';
  }, 300);
})();
