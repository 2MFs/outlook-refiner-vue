<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">Mail 文字潤色</h2>
    
    <button @click="getSelectedText" class="bg-blue-500 text-white px-4 py-2 mb-4">讀取選取文字</button>

    <div v-if="originalText">
      <h3>原始內容：</h3>
      <p class="bg-gray-100 p-2">{{ originalText }}</p>
    </div>

    <div class="mt-4">
      <label>選擇風格：</label>
      <select v-model="style">
        <option>正式</option>
        <option>創意</option>
        <option>專業</option>
        <option>簡潔</option>
      </select>

      <label class="ml-4">語言：</label>
      <select v-model="language">
        <option value="zh-TW">繁體中文</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>

      <label class="ml-4">AI 模型：</label>
      <select v-model="aiModel">
        <option>OpenAI</option>
        <option>Copilot</option>
        <option>Grok</option>
        <option>Gemini</option>
      </select>
    </div>

    <button @click="refineText" class="bg-green-500 text-white px-4 py-2 mt-4">潤色並翻譯</button>

    <div v-if="refinedText" class="mt-4">
      <h3>潤色結果：</h3>
      <p class="bg-green-100 p-2">{{ refinedText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { refineTextByAI } from './api/apiClient'

const originalText = ref('')
const refinedText = ref('')
const style = ref('正式')
const language = ref('zh-TW')
const aiModel = ref('OpenAI')

function getSelectedText() {
  Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, function (result) {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      originalText.value = result.value.data
    } else {
      alert('無法取得選取文字')
    }
  })
}

async function refineText() {
  refinedText.value = await refineTextByAI(originalText.value, {
    model: aiModel.value,
    style: style.value,
    language: language.value,
  })
}
</script>