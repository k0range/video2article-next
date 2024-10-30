import keydownHandler from "./keydownHandler";

function closeEffect() {
  document.removeEventListener('keydown', keydownHandler);

  const effectElement = document.getElementById("video-to-article-effect");
  if (effectElement) {
    effectElement.getElementsByClassName("video2article_backdrop")[0].classList.add("video2article_generated");
    effectElement.getElementsByClassName("video2article_rainbow-mist")[0].classList.add("video2article_generated");

    document.getElementsByTagName("ytd-app")[0].classList.add("video2article_closing");

    effectElement.classList.add("video2article_fadeout");
    setTimeout(() => {
      document.getElementsByTagName("ytd-app")[0].classList.remove("video2article_closing");
      effectElement.remove();
    }, 1000);
  }
}

export default closeEffect;