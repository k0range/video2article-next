async function addEffect() {
  let effectDiv = document.createElement("div");
  effectDiv.id = "video-to-article-effect";
  const effectHtml = await fetch(browser.runtime.getURL("effect.html"));
  effectDiv.innerHTML = await effectHtml.text();
  const noiseUrl = browser.runtime.getURL('noise.png');

  const backdropElement = effectDiv.querySelector('.backdrop');
  if ( backdropElement ) {
    backdropElement.style.backgroundImage = `url(${noiseUrl})`;
  }

  const iconImgElement = effectDiv.querySelector('.icon-img');
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
      effectElement.getElementsByClassName("backdrop")[0].classList.add("generated");
      effectElement.getElementsByClassName("rainbow-mist")[0].classList.add("generated");

      document.getElementsByTagName("ytd-app")[0].classList.add("closing");

      effectElement.classList.add("fadeout");
      setTimeout(() => {
        document.getElementsByTagName("ytd-app")[0].classList.remove("closing");
        effectElement.remove();
      }, 1000);
    }
  }

  const closeButton = effectDiv.querySelector(".close-button");
  if (closeButton) {
    closeButton.addEventListener("click", closeEffect);
  }

  document.body.appendChild(effectDiv);
  
  return effectDiv;
}

async function getVideo(videoPage: string) {
  const videoPageHtml = await (await fetch(videoPage)).text()

  const escapedTimedTextUrl = videoPageHtml.match(/https:\/\/www\.youtube\.com\/api\/timedtext\?v=[^"]*/);
  const timedTextUrl = JSON.parse(`"${escapedTimedTextUrl[0]}"`) // Unicode unescape

  const videoTitleMatch = videoPageHtml.match(/<meta property="og:title" content="([^"]+)">/)

  if ( !videoTitleMatch ) {
    return
  }

  const parser = new DOMParser();
  const videoTitleHtml = parser.parseFromString(videoTitleMatch[0], 'text/html');
  const videoTitle = videoTitleHtml.querySelector('meta')?.getAttribute('content')
  
  if ( timedTextUrl ) {
    const timedText = await (await fetch(timedTextUrl)).text();

    const parser = new DOMParser();
    const timedTextXml = parser.parseFromString(timedText, 'text/xml');
    let timedTextString = ""

    timedTextXml.querySelectorAll('text').forEach((transcript) => {
      const text = transcript.textContent
      timedTextString += text + "\n"
    })

    return {
      title: videoTitle,
      timedText: timedTextString
    }
  }
}

async function generateArticle(timedText: string, customPrompt?: string) {
  const prompt = `次のYouTube動画の字幕ファイルからMarkdownの記事を作成してください。
   - これは要約ではないため、動画の内容をできる限り残したまま（しかし字幕そのままはNG）長めの記事を作成してください。記事を短くする必要はないです。
   - 出力には記事の**内容**のみを含めてください。
   - 字幕ファイルそのままの内容の記事は避けてください。
   - 多くの字幕ファイルは動画内の音声をそのまま書いているため、そのまま記事にすると読みにくい記事になります。そのため、字幕ファイルをそのまま記事にせず、読みやすい文章に直してください。
   - 記事のタイトル、記事の最初に見出しをつけないでください。
   - 適度に文中の見出しを設けて読みやすい記事を作成してください。
   - 字幕ファイルに誤りだと考えられる記述（誤字）などがあった場合は、その部分を直して記事を書いてください
   
  ${customPrompt ? `追加の指示:
  \`\`\`
  ${customPrompt}
  \`\`\`` : ""}

  字幕ファイル:
  \`\`\`
  ${timedText}
  \`\`\`
  `

  const response = await chrome.runtime.sendMessage({
    type: "generateArticle",
    text: prompt
  });

  if (response.type === "no_api_key") {
    alert("APIキーが設定されていません。拡張機能のオプションからAPIキーを設定してください。")
    throw new Error("No API Key")
  } else if (response.type === "invalid_api_key") {
    alert("APIキーが無効です。拡張機能のオプションのAPIキーが正しいか確認してください。")
    throw new Error("Invalid API Key")
  } else if (response.type === "success") {
    return response.text
  }
}

async function insertReader(effectDiv: HTMLDivElement,title: string, content: string) {
  let readerUrl = new URL(chrome.runtime.getURL('reader.html'));
  readerUrl.searchParams.append('title', title);
  readerUrl.searchParams.append('content', content);

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
}

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    browser.runtime.onMessage.addListener(async (message) => {
      if (message.type === "clickedIcon") {
        if (document.getElementById("video-to-article-effect")) {
          return
        }

        // Stop video
        const videoElement = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;
        videoElement.pause()

        const effectDiv = await addEffect();

        const video = await getVideo(location.href)
        const videoTitle = video?.title
        const timedText = video?.timedText

        if (!timedText) {
          console.log("Failed to get timed text")
          return
        }

        if (!videoTitle) {
          console.log("Failed to get video title")
          return
        }

        const customPrompt = await storage.getItem('local:custom_prompt')
        const content = await generateArticle(timedText, customPrompt as string)
          .catch((error) => {
            console.error(error)
            document.getElementById("video-to-article-effect")?.remove()
            return
          });

        if (content) {
          await insertReader(effectDiv, videoTitle, content)
        }
      }
      return undefined
    });
  },
});
