async function insertReader(effectDiv: HTMLDivElement, title: string, content: string, images: string[] = []) {
  let readerUrl = new URL(chrome.runtime.getURL('reader.html'));
  //readerUrl.searchParams.append('title', title);
  //readerUrl.searchParams.append('content', content);
  //readerUrl.searchParams.append('images', JSON.stringify(images));

  let readerIframe = document.createElement("iframe");
  readerIframe.src = readerUrl.toString();
  readerIframe.id = "video2article_readerIframe";

  const articleContainer = effectDiv.getElementsByClassName("article-container")[0];
  articleContainer.insertBefore(readerIframe, articleContainer.firstChild);
  articleContainer.classList.remove("hidden");

  const generatingContainer = effectDiv.getElementsByClassName("generating-container")[0] as HTMLElement;
  generatingContainer.classList.add("fadeout");

  effectDiv.getElementsByClassName("backdrop")[0].classList.add("generated");
  effectDiv.getElementsByClassName("rainbow-mist")[0].classList.add("generated");
  console.log(content)
  readerIframe.onload = () => {
    readerIframe.contentWindow?.postMessage({
      type: 'articleData',
      title: title,
      content: content,
      images: images
    }, '*');
  };
}

export default insertReader