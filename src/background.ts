chrome.runtime.onInstalled.addListener((_)=> {
});

chrome.action.onClicked.addListener((tab)=>{
  chrome.tabs.sendMessage(tab.id, {_danimebutton: 'DANIME_BUTTON_CLICKED'});
});

chrome.declarativeContent.onPageChanged.removeRules(async ()=>{
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          schemes: ['https'],
          hostEquals: 'anime.dmkt-sp.jp',
          pathPrefix: '/animestore/ci_pc',
          queryContains: 'partId',
        },
      }),
    ],
    actions: [
      new chrome.declarativeContent.ShowPageAction(),
      new chrome.declarativeContent.SetIcon({
        imageData: await loadImageData('icon/32.png')
      }),
    ],
  }]);
});

function loadImageData(url): Promise<ImageData> {
  return new Promise(resolve => {
    const canvas = document.body.appendChild(document.createElement('canvas'));
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0);
      const data = context.getImageData(0, 0, img.width, img.height);
      canvas.remove();
      resolve(data);
    };
    img.src = url;
  });
}