/**
 * tweet contents
 */
export const TITLE_PLACEHOLDER = '%title%';
export const EPISODENUMBER_PLACEHOLDER = '%episodeNumber%';
export const EPISODETITLE_PLACEHOLDER = '%episodeTitle%';

export const DEFAULT_TWEET_TEXT = `${TITLE_PLACEHOLDER} ${EPISODENUMBER_PLACEHOLDER}を視聴しました！ #dアニメストア`;

export const TITLE_SELECTOR = '.headerText';
export const EPISODENUMBER_SELECTOR = '.episodeTitle .number';
export const EPISODETITLE_SELECTOR = '.episodeTitle .title';

export const getTitle = () => document.querySelector(TITLE_SELECTOR).textContent;
export const getEpisodeNumber = () => {
  return document.querySelector(EPISODENUMBER_SELECTOR).textContent;
}
export const getEpispodeTitle = () => {
  return document.querySelector(EPISODETITLE_SELECTOR).textContent;
}
export const getTweetUrl = () => encodeURIComponent(document.URL);

export const getTweetText = async () => {
  const tweetText: string = await new Promise((resolve, _rej) => {
    chrome.storage.local.get({tweetContent: ''}, ({ tweetContent }) => {
      resolve(tweetContent);
    });
  }) || DEFAULT_TWEET_TEXT;

  return encodeURIComponent(
    tweetText
      .replace(TITLE_PLACEHOLDER, getTitle())
      .replace(EPISODENUMBER_PLACEHOLDER, getEpisodeNumber())
      .replace(EPISODETITLE_PLACEHOLDER, getEpispodeTitle())
  );
};

export const getTweetIntentURL = async () => {
  const tweetText = await getTweetText();
  const tweetUrl = getTweetUrl();
  return `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
};
