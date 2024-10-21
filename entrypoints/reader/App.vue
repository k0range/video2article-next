<template>
  <div class="px-8 py-7">
    <h1 class="text-2xl text-white mb-6">{{ title }}</h1>
    <div class="prose prose-invert text-[#f1f1f1] prose-red prose-md w-full max-w-full" v-html="content"></div>
  </div>
</template>

<script lang="ts">
// TODO: v-html サニタイズ
// https://zenn.dev/kibe/articles/2a9f738a05dc5d

import { nextTick } from 'vue'
import { marked } from 'marked';

export default {
  data() {
    return {
      title: '',
      content: '',
      images: [],
    };
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    window.addEventListener('message', async (event) => {
      if (event.data.type === 'articleData') {
        const { title, content, images } = event.data;

        this.title = title;
        this.content = await marked(content || "");
        
        this.content.match(/\[img\s\d+(?:\.\d+)?-\d+(?:\.\d+)?\]/g)?.forEach(async (match, index) => {
          this.content = this.content.replace(match, `<img src="${images[index]}" />`);
        });

        await nextTick();

        const imgs = this.$el.querySelectorAll('img') as HTMLElement[];
        let loadedImgsCount = 0;

        if ( imgs.length === 0 ) {
          this.postIframeHeight();
        } else {
          imgs.forEach(img => {
            img.addEventListener('load', () => {
              loadedImgsCount++;

              if (loadedImgsCount === imgs.length) {
                this.postIframeHeight();
              }
            });
          });
        }
      }
    });
  },
  methods: {
    postIframeHeight() {
      window.parent.postMessage({ type: 'iframeHeight', height: document.documentElement.offsetHeight }, '*');
    },
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: sans-serif;
}

img {
  border-radius: 8px;
  border: 1px solid #3f3f3f;
}
</style>