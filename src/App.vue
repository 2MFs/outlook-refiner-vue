<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-2xl shadow-md">
    <!-- 標題與設定 -->
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-800">📬 Mail Refiner AI</h1>
      <button @click="showSettings = !showSettings" class="cursor-pointer text-sm text-gray-600 hover:text-blue-600">
        ⚙️ API 設定
      </button>
    </div>

    <!-- Alert 提示 -->
    <div
      v-if="alertMessage"
      :class="[
        'rounded-lg p-3 border text-sm relative',
        alertType === 'success' ? 'bg-green-100 text-green-800 border-green-300' :
        alertType === 'error' ? 'bg-red-100 text-red-800 border-red-300' :
        'bg-blue-100 text-blue-800 border-blue-300'
      ]"
    >
      {{ alertMessage }}
      <button type="button"
        @click="clearAlert" 
        :class="[alertType === 'success' ? 'text-green-800' : alertType === 'error' ? 'text-red-800' : 'text-blue-800']"
        class="cursor-pointer absolute top-3.5 end-2.5 text-xs hover:text-gray-800">✖</button>
    </div>

    <!-- 設定區塊 -->
    <div v-if="showSettings" class="border p-4 rounded-lg bg-gray-50 space-y-3">
      <h2 class="text-md font-semibold text-gray-700">API 設定</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-600 block">OpenAI API URL</label>
          <input v-model="settings.openai_url" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">OpenAI API KEY</label>
          <input v-model="settings.openai_key" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Grok API URL</label>
          <input v-model="settings.grok_url" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Grok API KEY</label>
          <input v-model="settings.grok_key" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Copilot API URL</label>
          <input v-model="settings.copilot_url" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Copilot API KEY</label>
          <input v-model="settings.copilot_key" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Gemini API URL</label>
          <input v-model="settings.gemini_url" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-600 block">Gemini API KEY</label>
          <input v-model="settings.gemini_key" type="text" class="w-full p-2 border rounded" />
        </div>
      </div>
      <button @click="saveSettings" class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
        儲存設定
      </button>
    </div>
    <div>
      <p v-if="isTextSelected" class="text-sm text-green-600">✅ 已選取文字，請選擇要潤色或翻譯的操作。</p>
      <p v-else class="text-sm text-red-500">⚠️ 尚未選取任何文字，請先選擇郵件中的文字。</p>
    </div>

    <textarea
      v-model="inputText"
      placeholder="請貼上要潤色或翻譯的文字，或者選擇郵件中的一段文字"
      class="w-full h-40 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      @input="handleTextInput"
    ></textarea>

    <div class="flex gap-3">
      <button id="get-selected-text-button"
        @click="getSelectedText"
        class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        :disabled="isTextSelected"
      >
        從郵件選取文字
      </button>

      <button id="action-button"
        @click="handleAction"
        class="cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected"
      >
        執行
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">操作模式</label>
        <select v-model="mode" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="refine">潤色</option>
          <option value="translate">翻譯</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">使用模型</label>
        <select v-model="provider" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="openai">OpenAI</option>
          <option value="copilot">Copilot</option>
          <option value="grok">Grok</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">潤色風格</label>
        <select v-model="style" :disabled="mode !== 'refine'" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">
          <option>正式</option>
          <option>創意</option>
          <option>簡潔</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">翻譯語言</label>
        <select v-model="language" :disabled="mode !== 'translate'" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">
          <option>英文</option>
          <option>日文</option>
          <option>韓文</option>
          <option>繁體中文</option>
        </select>
      </div>
    </div>

    <div v-if="result" class="p-4 border rounded-lg bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">🎯 處理結果：</h2>
      <p class="whitespace-pre-line text-gray-800">{{ result }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { refineText, translateText } from "./api/apiClient";

const inputText = ref("");
const result = ref("");
const provider = ref("openai");
const style = ref("正式");
const language = ref("英文");
const mode = ref("refine");
const isTextSelected = ref(false);
const showSettings = ref(false);

const settings = ref({
  openai_url: localStorage.getItem("openai_url") || "",
  openai_key: localStorage.getItem("openai_key") || "",
  grok_url: localStorage.getItem("grok_url") || "",
  grok_key: localStorage.getItem("grok_key") || "",
  copilot_url: localStorage.getItem("copilot_url") || "",
  copilot_key: localStorage.getItem("copilot_key") || "",
  gemini_url: localStorage.getItem("gemini_url") || "",
  gemini_key: localStorage.getItem("gemini_key") || "",
});

// alert 狀態
const alertMessage = ref("");
const alertType = ref("info"); // success | error | info

// 顯示 alert
function showAlert(message, type = "info") {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = "";
  }, 3000);
}
function clearAlert() {
  alertMessage.value = "";
}

// 設定儲存
function saveSettings() {
  localStorage.setItem("openai_url", settings.value.openai_url);
  localStorage.setItem("openai_key", settings.value.openai_key);
  localStorage.setItem("grok_url", settings.value.grok_url);
  localStorage.setItem("grok_key", settings.value.grok_key);
  localStorage.setItem("copilot_url", settings.value.copilot_url);
  localStorage.setItem("copilot_key", settings.value.copilot_key);
  localStorage.setItem("gemini_url", settings.value.gemini_url);
  localStorage.setItem("gemini_key", settings.value.gemini_key);

  showAlert("✅ 已儲存 API 設定", "success");
}

function handleTextInput() {
  isTextSelected.value = inputText.value.trim().length > 0;
  if (isTextSelected.value) {
    document.getElementById("get-selected-text-button").disabled = true;
    document.getElementById("action-button").disabled = false;

    document.getElementById("get-selected-text-button").classList.add("cursor-not-allowed");
    document.getElementById("get-selected-text-button").classList.remove("cursor-pointer");
    document.getElementById("action-button").classList.remove("cursor-not-allowed");
    document.getElementById("action-button").classList.add("cursor-pointer");
  } else {
    document.getElementById("get-selected-text-button").disabled = false;
    document.getElementById("action-button").disabled = true;

    document.getElementById("get-selected-text-button").classList.remove("cursor-not-allowed");
    document.getElementById("get-selected-text-button").classList.add("cursor-pointer");
    document.getElementById("action-button").classList.add("cursor-not-allowed");
    document.getElementById("action-button").classList.remove("cursor-pointer");
  }
}

// 取得郵件選取文字
function getSelectedText() {
  if (!Office.context?.mailbox?.item) {
    showAlert("⚠️ 增益集尚未載入完成", "error");
    return;
  }

  Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, function (result) {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      inputText.value = result.value.data;
      isTextSelected.value = inputText.value.trim().length > 0;
      showAlert("✅ 已載入選取文字", "success");
    } else {
      showAlert("❌ 無法取得選取文字", "error");
    }
  });
}

async function handleAction() {
  result.value = "⏳ 處理中...";
  try {
    const textToProcess = inputText.value;
    if (mode.value === "refine") {
      result.value = await refineText(provider.value, textToProcess, style.value);
    } else if (mode.value === "translate") {
      result.value = await translateText(provider.value, textToProcess, language.value);
    }
  } catch (err) {
    console.error(err);
    result.value = "❌ 發生錯誤，請檢查 API 設定或輸入內容";
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
