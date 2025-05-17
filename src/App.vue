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
    <div v-if="alertMessage" :class="[
      'rounded-lg p-3 border text-sm relative',
      alertType === 'success' ? 'bg-green-100 text-green-800 border-green-300' :
        alertType === 'error' ? 'bg-red-100 text-red-800 border-red-300' :
          'bg-blue-100 text-blue-800 border-blue-300'
    ]">
      {{ alertMessage }}
      <button type="button" @click="clearAlert"
        :class="[alertType === 'success' ? 'text-green-800' : alertType === 'error' ? 'text-red-800' : 'text-blue-800']"
        class="cursor-pointer absolute top-3.5 end-2.5 text-xs hover:text-gray-800">✖</button>
    </div>

    <div v-if="showSettings" class="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
      <h2 class="text-xl font-semibold text-gray-800">API 設定</h2>

      <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px" id="api-setting-tab" data-tabs-toggle="#api-setting-tab-content"
          role="tablist">
          <li v-for="tabList in tabs" :key="tabList" class="me-2" role="presentation">
            <button :id="tabList + `-tab`" :data-tabs-target="`#` + tabList" type="button" role="tab"
              :aria-controls="tabList" aria-selected="false"
              class="cursor-pointer inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === tabList
                ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'"
              @click="activeTab = tabList">
              {{ tabList }}
            </button>
          </li>
        </ul>
      </div>
      <div id="api-setting-tab-content">
        <template v-for="tabContent in tabs" :key="tabContent">
          <div :class="activeTab === tabContent ? '' : 'hidden'" class="grid grid-cols-1 md:grid-cols-1 px-4"
            :id="tabContent" role="tabpanel" :aria-labelledby="tabContent + `-tab`">
            <div class="relative z-0 w-full mb-5 group" v-if="tabContent.includes('Free') === false">
              <input :id="tabContent + `_url`" :name="tabContent + `_url`"
                v-model="settings[tabContent.toLowerCase() + '_url']" type="text"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="" />
              <label :for="tabContent + `_url`"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                API URL
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group" v-if="tabContent.includes('Free') === false">
              <input :id="tabContent + `_key`" :name="tabContent + `_key`"
                v-model="settings[tabContent.toLowerCase() + '_key']" :type="showPassword ? 'text' : 'password'"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="" />
              <button type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-300"
                @click="togglePassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M9.88 9.88a3 3 0 014.24 4.24M3 3l18 18" />
                </svg>
              </button>
              <label :for="tabContent + `_key`"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                API KEY
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group" v-if="tabContent.includes('Free') === false">
              <input :id="tabContent + '_model'" :name="tabContent + '_model'"
                v-model="settings[tabContent.toLowerCase() + '_model']" type="text"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="" />
              <label :for="tabContent + '_model'"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Model
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <label class="inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"
                  v-model="settings[tabContent.toLowerCase() + '_default']"
                  @change="toggleDefaultAi(tabContent.toLowerCase())" />
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">預設AI</span>
              </label>
            </div>
          </div>
        </template>
      </div>

      <!-- 儲存按鈕 -->
      <div class="flex justify-center pt-6">
        <button @click="saveSettings"
          class="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
          💾 儲存設定
        </button>
      </div>

      <div class="mt-4 text-sm text-green-600 dark:text-green-300" v-if="defaultProvider">
        ✅ 目前預設 AI：<strong>{{ defaultProvider }}</strong>
      </div>

    </div>

    <div>
      <p v-if="isTextSelected" class="text-sm text-green-600">✅ 已選取文字，請選擇要潤色或翻譯的操作。</p>
      <p v-else class="text-sm text-red-500">⚠️ 尚未選取任何文字，請先選擇郵件中的文字。</p>
    </div>

    <textarea v-model="inputText" placeholder="請貼上要潤色或翻譯的文字，或者選擇郵件中的一段文字"
      class="w-full h-40 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      @input="handleTextInput"></textarea>

    <div v-if="result" class="p-4 border rounded-lg bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">🎯 處理結果：</h2>
      <p class="whitespace-pre-line text-gray-800">{{ result }}</p>
    </div>

    <div class="flex gap-3">
      <button ref="getSelectedBtn" @click="wrappedGetSelectedText"
        class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="isTextSelected">
        從郵件選取文字
      </button>

      <button ref="setSelectedBtn" @click="wrappedSetSelectedText"
        class="cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected">
        覆蓋郵件選取文字
      </button>

      <button ref="clearTextBtn" @click="wrappedSetClearText"
        class="cursor-not-allowed bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected">
        清除
      </button>

      <button ref="actionBtn" @click="wrappedHandleAction"
        class="cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected">
        執行
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">操作模式</label>
        <select v-model="mode"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="refine">潤色</option>
          <option value="translate">翻譯</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">使用模型</label>
        <select v-model="defaultProvider"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <template v-for="provider in tabs" :key="provider">
            <option
              v-if="(settings[provider.toLowerCase() + '_url'] !== '' && settings[provider.toLowerCase() + '_model'] !== '') "
              :value="provider.toLowerCase()">{{ provider }} (本地API)</option>
            <option
              v-else-if="(providersList[provider.toLowerCase()].url !== '' && providersList[provider.toLowerCase()].model !== '')"
              :value="provider.toLowerCase()">{{ provider }} <template v-if="provider.toLowerCase() !== 'free'">(雲端API)</template></option>
            <option  v-else :value="provider.toLowerCase()" disabled>{{ provider }} (未設定)
            </option>
          </template>

        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">潤色風格</label>
        <select v-model="style" :disabled="mode !== 'refine'"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">
          <option>正式</option>
          <option>創意</option>
          <option>簡潔</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">翻譯語言</label>
        <select v-model="language" :disabled="mode !== 'translate'"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">
          <option>英文</option>
          <option>日文</option>
          <option>韓文</option>
          <option>繁體中文</option>
        </select>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useConfigStore } from 'stores/config';
import { useProviders } from 'apis/providers';
import { refineText, translateText } from "utils/aiClient";

/**
 *  初始區塊
 */
const providersList = useProviders() || providers.flatMap();
//初始定義
const tabs = ['OpenAI', 'Grok', 'Claude', 'Gemini', 'Customize', 'Free'] // API 提供者名稱
const providers = tabs.map(t => t.toLowerCase()); // 確保兩邊一致
const fields = ['url', 'key', 'model', 'default']; // API 設定的欄位名稱
const keys = providers.flatMap(p => fields.map(f => `${p}_${f}`)); // 生成 localStorage 的 key 名稱，如 openai_url、openai_key、openai_model
//const envKeys = providers.flatMap(p => fields.map(f => `${p.toUpperCase()}_API_${f.toUpperCase()}`)); // 生成環境變數的 key 名稱，如 VUE_APP_OPENAI_URL、VUE_APP_OPENAI_KEY、VUE_APP_OPENAI_MODEL

// alert 狀態
const alertMessage = ref("");
const alertType = ref("info"); // success | error | info

//預設值
const defaultProvider = ref('free');
const activeTab = ref('OpenAI') // 把 tab 名稱轉成 settings 的 key prefix（如 openai_url） const activeKey = computed(() => activeTab.value.toLowerCase())
const inputText = ref(""); // 使用者輸入的文字
const result = ref(""); // API 回傳的結果
const style = ref("正式"); // 潤色風格
const language = ref("英文"); // 翻譯語言
const mode = ref("refine"); // 操作模式（潤色或翻譯）
const isTextSelected = ref(false); // 是否有選取文字
const showSettings = ref(false); // 是否顯示設定視窗
const getSelectedBtn = ref(null)
const setSelectedBtn = ref(null)
const clearTextBtn = ref(null)
const actionBtn = ref(null)
const showPassword = ref(false);

// 綁定事件時使用包裝後的版本
const wrappedGetSelectedText = withHideSettings(getSelectedText);
const wrappedSetSelectedText = withHideSettings(setSelectedText);
const wrappedSetClearText = withHideSettings(setClearText);
const wrappedHandleAction = withHideSettings(handleAction);

// 讀取 localStorage 中的設定 /*import.meta.env[envKeys[keys.indexOf(key)]]*/
const settings = ref(
  Object.fromEntries(keys.map(key => [key, localStorage.getItem(key) || (key.includes('_default') ? false : '')]))
)

/**
 * 初始化階段
 */
onMounted(async () => {
  const configStore = useConfigStore();  
  //loadConfig();
  await configStore.loadConfig(); // 載入設定

  if (configStore.isLoaded) {
    providersList = useProviders(); // 此時 config 已就緒
    // 可放心使用 providers
  }

  loadDefaultProvider();
});

// 監聽office.js 事件
Office.onReady(function (info) {

  if (info.host === null || info.platform === null) {
    showAlert("⚠️ Office.js 尚未載入完成，請稍後再試。", 'error');
    return;
  }

  showAlert(`✅ Office.js 已經載入完成，Office應用為 ${info.host} ，平台為 ${info.platform}`, 'info');
});

/**
 * JS功能模塊
 */

function loadDefaultProvider() {
  const provider = Object.keys(localStorage)
    .find(key => key.endsWith('_default') && localStorage.getItem(key) === 'true')
    ?.replace('_default', '') || 'free';

  defaultProvider.value = provider;
  settings.value[`${provider}_default`] = true;
}

// 所有會自動關閉設定視窗的操作包裝器
function withHideSettings(fn) {
  return function (...args) {
    showSettings.value = false
    fn(...args)
  }
}

// 切換顯示
function togglePassword() {
  showPassword.value = !showPassword.value;
}

// 顯示 alert
function showAlert(message, type = "info") {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = "";
  }, 3000);
}

// 清除 alert
function clearAlert() {
  alertMessage.value = "";
}

// 切換預設 AI
function toggleDefaultAi(tabContent) {

  // 當此為 true，其它全部設為 false
  tabs.forEach(tab => {

    const lowerTab = tab.toLowerCase();

    if (tab.toLowerCase() === tabContent) {
      settings.value[lowerTab + '_default'] = true;
    } else {
      //checkbox.checked = false
      settings.value[lowerTab + '_default'] = false;
    }
  })
}

// 設定儲存
function saveSettings() {
  let newDefault = '';

  for (const key of keys) {
    const value = settings.value[key];
    localStorage.setItem(key, value);

    if (key.endsWith('_default') && value === true) {
      newDefault = key.slice(0, -8).toLowerCase(); //replace("_default", "")
    }
  }

  if (newDefault) {
    defaultProvider.value = newDefault; //儲存後才更新
  }

  showAlert("✅ 已儲存 API 設定", "success");
}

// 監聽 Button 變更
function seTextSelected(isSelected) {
  const buttons = [
    { el: getSelectedBtn.value, enabled: !isSelected },
    { el: setSelectedBtn.value, enabled: isSelected },
    { el: clearTextBtn.value, enabled: isSelected },
    { el: actionBtn.value, enabled: isSelected },
  ]

  buttons.forEach(({ el, enabled }) => {
    if (!el) return
    el.disabled = !enabled
    el.classList.toggle('cursor-not-allowed', !enabled)
    el.classList.toggle('cursor-pointer', enabled)
  })
}

// 監聽文字輸入
function handleTextInput() {
  isTextSelected.value = inputText.value.trim().length > 0;
  //變更button狀態
  seTextSelected(isTextSelected.value);
}

// 清除文字
function setClearText() {
  if (isTextSelected.value) {
    inputText.value = "";
    isTextSelected.value = false;

    //變更button狀態        
    seTextSelected(isTextSelected.value);
  }
}

// 覆蓋郵件選取文字
function setSelectedText() {
  if (!Office.context?.mailbox?.item) {
    showAlert("⚠️ 增益集尚未載入完成", "error");
    return;
  }

  if (Office.context?.mailbox?.item?.setSelectedDataAsync) {
    Office.context.mailbox.item.setSelectedDataAsync(inputText.value, function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        showAlert("✅ 已覆蓋郵件選取文字", "success");
      } else {
        showAlert("❌ 無法覆蓋郵件選取文字", "error");
      }
    });
  } else {
    showAlert("⚠️ 無法使用 setSelectedDataAsync，請確認增益集環境", "error");
  }
}

// 取得郵件選取文字
function getSelectedText() {
  if (!Office.context?.mailbox?.item) {
    showAlert("⚠️ 增益集尚未載入完成", "error");
    return;
  }

  if (Office.context?.mailbox?.item?.getSelectedDataAsync) {
    Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        inputText.value = result.value.data;
        isTextSelected.value = inputText.value.trim().length > 0;
        //變更button狀態
        seTextSelected(isTextSelected.value);
        showAlert("✅ 已載入選取文字", "success");
      } else {
        showAlert("❌ 無法取得選取文字", "error");
      }
    });
  } else {
    showAlert("⚠️ 無法使用 getSelectedDataAsync，請確認增益集環境", "error");
  }
}

// 處理文字
async function handleAction() {
  if (!isTextSelected.value) {
    showAlert("⚠️ 尚未選取任何文字，請先選擇郵件中的文字。", "error");
    return;
  }

  result.value = "⏳ 處理中...";
  try {
    const textToProcess = inputText.value;
    if (mode.value === "refine") {
      result.value = await refineText(providersList, defaultProvider.value, textToProcess, style.value);
    } else if (mode.value === "translate") {
      result.value = await translateText(providersList, defaultProvider.value, textToProcess, language.value);
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
