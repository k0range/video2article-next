import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifestVersion: 3,
  manifest: {
    name: "Video to Article Next",
    description: "YouTubeの動画をAIで記事に変換します。",
    icons: {
      32: "icon/32.png",
      64: "icon/64.png",
      128: "icon/128.png",
      256: "icon/256.png"
    },
    version: "1.1.2",
    author: 'Korange',
    action: {
      default_popup: undefined
    },
    web_accessible_resources: [{
      resources: ['effect.html', 'effect.js', 'noise.png', 'sparkles.svg', 'reader.html'],
      matches: ['*://*.youtube.com/*']
    }],
    browser_specific_settings: {
      gecko: {
        id: "video2article-next@ext.korange.work"
      }
    },
    permissions: ['tabs', 'storage']
  }
});
