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
      timedTextString += `[${transcript.getAttribute('start')}-${transcript.getAttribute('dur')}] ${text}` + "\n"
    })

    return {
      title: videoTitle,
      timedText: timedTextString
    }
  }
}

export default getVideo