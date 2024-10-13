async function generateArticle(timedText: string, customPrompt?: string, includesImage: boolean = true) {
  const prompt = `次のYouTube動画の字幕ファイルからMarkdownの記事を作成してください。
  ${includesImage ? ` - 字幕の内容だけだと動画の内容を理解するのに不十分だと考えられる部分**のみ**、次の構文で画像を追加してください。画像は文の間には（インラインでは）含めないでください。
      - 画像の追加方法: \`[img （参照したい部分の字幕にある[]で囲われた数字）]\`
      - 例: \`[img 39.2-5]\`
      - 注意: 数字は順番ではなく、字幕にある数字を参照してください。
      - **画像は記事に最大５個にとどめてください。すべての字幕には数字が付いていますが、すべての字幕に画像を付ける必要はありません。**` : ""}
   - これは要約ではないため、動画の内容をできる限り残したまま（しかし字幕そのままはNG）長めの記事を作成してください。記事を短くする必要はないです。
   - 出力には記事の**内容**のみを含めてください。
   - 記事のタイトル、記事の最初に見出しをつけないでください。
   - 適度に文中の見出しを設けて読みやすい記事を作成してください。
   - 字幕の中の[]の中にある数字は記事には含めないでください。
   - 字幕ファイルに誤りだと考えられる記述（誤字）などがあった場合は、その部分を直して記事を書いてください。
   - 字幕ファイルそのままのような内容の記事は避けてください。
   - 字幕ファイルをそのまま記事にすると読みにくい記事になります。なので、字幕は記事として読みやすい文章の段落に直してください。
   
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

export default generateArticle