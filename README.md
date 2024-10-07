<img src="https://github.com/user-attachments/assets/6f208fbd-77d3-4634-ac5c-a0a8a47e737b" height=64 align="right">

# Video to Article (Next)

動画をAIで記事に変換して読むことができるブラウザ拡張機能です。

<video src="https://github.com/user-attachments/assets/03ea1add-bebe-4eb1-ba0b-0444658f07d5" controls="true"></video>

> [クリエイティブ・コモンズ](https://support.google.com/youtube/answer/2797468)に基づき[Yusuke](https://www.youtube.com/@yu_sukemon)様の[【ゆっくり実況】霊夢と魔理沙と妖夢のマインクラフト #1](https://www.youtube.com/watch?v=4uA_gGiTSP0)を使用しています。

> [!NOTE]
> 本拡張機能を使用するには[Googleのサイト](https://ai.google.dev/)で Gemini の API キーを取得しておく必要があります。  
> また、Gemini APIを従量課金プランにしている場合、APIの使用料が発生します。

## インストール
### Chromeウェブストアで配布中です🎉
[![Available in the Chrome Web Store](https://github.com/user-attachments/assets/25b4a7b5-3d70-451b-8e13-04818bc875bd)](https://chromewebstore.google.com/detail/video-to-article-next/igakbobplmmapmegojikbofmjajommco)

<details>
<summary>手動でインストールする方法</summary>

----
### Releases からダウンロード
[このリポジトリのReleasesページ](https://github.com/k0range/video2article-next/releases/latest)から`video2article-next-～～-chrome.zip`をダウンロードします。
![](readme-assets/releases.png)

### ZIP ファイルを展開
ダウンロードしたZIPファイルを展開します。

### Chrome に追加
1. [chrome://extensions](chrome://extensions)にアクセスし、画面右上の「デベロッパーモード」を有効にします。
![](readme-assets/chrome-devmode.png)

2. 「パッケージ化されていない拡張機能を読み込む」をクリックし、ZIPファイルを展開したフォルダを選択します。

インストールはこれで完了です。利用するには 詳細 > 拡張機能のオプション にGeminiのAPIキーを入力する必要があります。

----

</details>

## Gemini API キーの取得手順
1. [Google AI Studio](https://aistudio.google.com/)を開きます。（Googleアカウントが必要です）

2. 左サイドバーの「Get API key」から進み、「APIキーを作成」をクリックします。
   ![](https://github.com/user-attachments/assets/746ac2d9-ced3-4f77-aca4-63867c8075e0)
  
3. 「新しいプロジェクトで API キーを作成」を選びます。
   ![](https://github.com/user-attachments/assets/a7e845b6-300c-474d-a335-f63bdc35bfb7)

5. 生成されたAPIキーをコピーして、拡張機能のオプションに貼り付けます。
   ![Frame 168](https://github.com/user-attachments/assets/842746ca-97e6-4a16-8a1c-17e97ff4134d)

 > [!WARNING]
 > APIキーは教えたり、共有したりしないでください。

5. 作成したAPIキーの「プラン」が意図しないものになっていないことを確認します。
   ![](readme-assets/api-plan.png)
