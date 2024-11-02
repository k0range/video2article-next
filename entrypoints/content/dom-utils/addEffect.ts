import closeEffect from "../utils/closeEffect";

async function addEffect() {
  let effectDiv = document.createElement("div");
  effectDiv.id = "video-to-article-effect";
  const effectHtml = await fetch(browser.runtime.getURL("effect.html"));
  effectDiv.innerHTML = await effectHtml.text();

  const backdropElement = effectDiv.querySelector('.video2article_backdrop');
  if ( backdropElement ) {
    const noiseUrl = browser.runtime.getURL('noise.png');
    backdropElement.style.backgroundImage = `url(${noiseUrl})`;
  }

  const iconImgElement = effectDiv.querySelector('.video2article_icon-img');
  if ( iconImgElement ) {
    iconImgElement.src = browser.runtime.getURL('sparkles.svg');
  }

  //const script = document.createElement("script")
  //const effectJS = await fetch(browser.runtime.getURL("effect.js"))
  //script.textContent = await effectJS.text()
  //effectDiv.appendChild(script);

  // ここに書く
  window.addEventListener('message', (event) => {
    if (event.data.type === "iframeHeight") {
      const iframe = document.getElementById('video2article_readerIframe'); // resizableIframeはiframeのID名に置き換える
      if ( iframe ) {
        iframe.style.height = `${event.data.height}px`;
      }
    } else if (event.data.type === "close") {
      closeEffect();
    }
  });

  const closeButton = effectDiv.querySelector(".video2article_close-button");
  if (closeButton) {
    closeButton.addEventListener("click", closeEffect);
  }

  document.body.appendChild(effectDiv);
  
  return effectDiv;
}

export default addEffect