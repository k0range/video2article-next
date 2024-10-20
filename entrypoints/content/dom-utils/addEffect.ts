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
    }
  });

  function closeEffect() {
    const effectElement = document.getElementById("video-to-article-effect");

    if (effectElement) {
      effectElement.getElementsByClassName("video2article_backdrop")[0].classList.add("video2article_generated");
      effectElement.getElementsByClassName("video2article_rainbow-mist")[0].classList.add("video2article_generated");

      document.getElementsByTagName("ytd-app")[0].classList.add("video2article_closing");

      effectElement.classList.add("video2article_fadeout");
      setTimeout(() => {
        document.getElementsByTagName("ytd-app")[0].classList.remove("closing");
        effectElement.remove();
      }, 1000);
    }
  }

  const closeButton = effectDiv.querySelector(".video2article_close-button");
  if (closeButton) {
    closeButton.addEventListener("click", closeEffect);
  }

  document.body.appendChild(effectDiv);
  
  return effectDiv;
}

export default addEffect