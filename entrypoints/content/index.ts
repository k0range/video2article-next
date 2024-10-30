import { storage } from 'wxt/storage';

import addEffect from "./dom-utils/addEffect";
import insertReader from "./dom-utils/insertReader";

import getVideo from "./services/getVideo";
import generateArticle from "./services/generateArticle";

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
          console.error("Failed to get timed text")
          return
        }

        if (!videoTitle) {
          console.error("Failed to get video title")
          return
        }

        const includesImage = (await storage.getItem('local:includes_image')) || true
        const customPrompt = await storage.getItem('local:custom_prompt')
        const content = await generateArticle(timedText, customPrompt as string, includesImage as boolean | undefined)
          .catch((error) => {
            console.error(error)
            document.getElementById("video-to-article-effect")?.remove()
            return
          });

        if (content) {
          // timedTextに画像構文が入っている場合、そのフレームの画像を取得する
          // 画像構文の例: [img 39.2-5] （小数点は入らない場合もある）
          let images: string[] = []

          const matches = content?.match(/\[img\s\d+(?:\.\d+)?-\d+(?:\.\d+)?\]/g) || []
          const video = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;
          const currentTimeStore = video.currentTime
          for (const match of matches) {
            const timeRange = match.replace(/\[img |\]/g, '');
            const [start, dur] = timeRange.split("-").map(parseFloat)
            video.currentTime = start + dur / 4

            await new Promise<void>((resolve) => {
              video.addEventListener('seeked', () => resolve(), { once: true });
            });

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            const imageBase64 = canvas.toDataURL("image/webp");
            images.push(imageBase64)
          }
          video.currentTime = currentTimeStore // 元の時間に戻す

          const escToClose = await storage.getItem('local:esc_to_close') ?? true
          await insertReader(effectDiv, videoTitle, content, images, escToClose as boolean);
        }
      }
      return undefined
    });
  },
});
