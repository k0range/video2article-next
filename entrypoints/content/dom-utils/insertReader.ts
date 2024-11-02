import closeEffect from "../utils/closeEffect";
import keydownHandler from "../utils/keydownHandler";

async function insertReader(effectDiv: HTMLDivElement, title: string, content: string, images: string[] = [], escToClose: boolean = true) {
  let readerUrl = new URL(chrome.runtime.getURL('reader.html'));
  //readerUrl.searchParams.append('title', title);
  //readerUrl.searchParams.append('content', content);
  //readerUrl.searchParams.append('images', JSON.stringify(images));

  let readerIframe = document.createElement("iframe");
  readerIframe.src = readerUrl.toString();
  readerIframe.id = "video2article_readerIframe";

  const articleContainer = effectDiv.getElementsByClassName("video2article_article-container")[0];
  articleContainer.insertBefore(readerIframe, articleContainer.firstChild);
  articleContainer.classList.remove("video2article_hidden");

  const generatingContainer = effectDiv.getElementsByClassName("video2article_generating-container")[0] as HTMLElement;
  generatingContainer.classList.add("video2article_fadeout");

  effectDiv.getElementsByClassName("video2article_backdrop")[0].classList.add("video2article_generated");
  effectDiv.getElementsByClassName("video2article_rainbow-mist")[0].classList.add("video2article_generated");
  console.log(content)
  readerIframe.onload = () => {
    readerIframe.contentWindow?.postMessage({
      type: 'articleData',
      title: title,
      content: content,
      images: images
    }, '*');
  };

  // ESC to close
  if ( escToClose ) {
    document.addEventListener('keydown', keydownHandler);
  }
}

export default insertReader