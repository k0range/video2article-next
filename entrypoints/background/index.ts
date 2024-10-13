import { browser } from 'wxt/browser';
import { storage } from 'wxt/storage';
import { GoogleGenerativeAI } from "@google/generative-ai";

function generateContentMock(request: any): Promise<{ response: { text: () => Promise<string> } }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (request) {
        resolve({
          response: {
            text: () => Promise.resolve(`Generated content for: ${request}`)
          }
        });
      } else {
        reject(new Error("Invalid request"));
      }
    }, 3000); // Simulate async operation with 1 second delay
  });
}

export default defineBackground(() => {
  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await browser.tabs.query(queryOptions);
    return tabs[0];
  }
  
  function extractVideoID(url: string) {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
  
  browser.action.onClicked.addListener(function(){
    getCurrentTab()
      .then(result => {
        if ( result.url ) {
          browser.tabs.sendMessage(result.id, {"type": "clickedIcon"})
  
          const pattern = /^https?:\/\/(www\.)?youtube\.com\/watch\?.*/;
            if (result.url.match(pattern)) {
              const videoId = new URL(result.url).searchParams.get("v");
            }
          }
      })
  });

  interface Message {
    type: string;
    text: string;
  }

  browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (message.type === "generateArticle") {
      storage.getItem('local:api_key').then((apiKey) => {
        if ( !apiKey ) {
          sendResponse({ type: 'no_api_key' });
          return
        }

        const genAI = new GoogleGenerativeAI(apiKey as string) // 公開するときにはAPIキーを隠す

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        model.generateContent(message.text)
          .then((response) => {
            const responseText = response.response.text()
            sendResponse({ type: 'success', text: responseText });
          })
          .catch((error) => {
            console.error(error)
            if (error.errorDetails[0].reason === "API_KEY_INVALID") {
              sendResponse({ type: 'invalid_api_key' });
              return
            }
            console.error(error)
          });
      });
    }
    
    return true
  });
});
