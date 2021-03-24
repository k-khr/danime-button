chrome.runtime.onInstalled.addListener((_)=> {
});

chrome.action.onClicked.addListener((tab)=>{
  chrome.tabs.sendMessage(tab.id, {_danimebutton: 'DANIME_BUTTON_CLICKED'});
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, async ()=>{
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
      // new chrome.declarativeContent.ShowPageAction(),
      new chrome.declarativeContent.SetIcon({
        imageData: await createIcon()
      }),
    ],
  }]);
});

function createIcon(): Promise<ImageData> {
  return new Promise(resolve => {
    const size = 32;
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    // background
    ctx.fillStyle = '#eb5528';
    ctx.fillRect(0, 0, size, size);
    // "d"
    ctx.fillStyle = '#fff';
    ctx.font = '900 26px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('d', size>>1, (size>>1)+2);
    const imageData = ctx.getImageData(0, 0, size, size);
    return resolve(imageData);
  });
}