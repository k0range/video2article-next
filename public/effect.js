function resizeIframe(iframe) {
  iframe.width = iframe.contentWindow.document.body.scrollWidth;
  iframe.height = iframe.contentWindow.document.body.scrollHeight;
}
alert("a")
  alert("a")
  const noiseUrl = browser.runtime.getURL('noise.png');
  document.querySelector('.backdrop').style.backgroundImage = `url(${noiseUrl})`;

  const observer = new MutationObserver((mutationsList, observer) => {
    alert("Mutation observer");
    mutationsList.forEach(mutation => {
      alert("Mutation detected");
      if (mutation.type === 'childList') {
        alert("Mutation detected2");
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
          resizeIframe(iframe);
        }
      }
    });
  });

  observer.observe(document.getElementsByClassName("effect"), { childList: true, subtree: true });
