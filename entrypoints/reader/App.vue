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
    };
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    this.title = urlParams.get('title') || 'New Title';
    this.content = await marked(urlParams.get('content') || ""); // iframeでアドレスは見えないのでクソ長URLクエリでも問題ない！ﾖｼ！

    await nextTick();

    window.parent.postMessage({ type: 'iframeHeight', height: document.documentElement.offsetHeight }, '*');
  },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: Hiragino Maru Gothic Pro,BIZ UDGothic,Roboto,HelveticaNeue,Arial,sans-serif;
}
</style>