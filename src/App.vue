<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-2xl shadow-md">
    <!-- 標題與設定 -->
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-800">📬 {{ $t("Email refiner AI") }}</h1>
      <button @click="showSettings = !showSettings" class="cursor-pointer text-sm text-gray-600 hover:text-blue-600">
        ⚙️ {{ $t("API Settings") }}
      </button>
    </div>

    <Declaration />

    <!-- Alert 提示 -->
    <!--
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
    -->
    <AlertDisplay />

    <div v-if="showSettings" class="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
      <h2 class="text-xl font-semibold text-gray-800">{{ $t("API Settings") }}</h2>

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
                {{ $t("API URL") }}
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
                {{ $t("API KEY") }}
              </label>
            </div>
            <div class="relative z-0 w-full mb-5 group" v-if="tabContent.includes('Free') === false">
              <input :id="tabContent + '_model'" :name="tabContent + '_model'"
                v-model="settings[tabContent.toLowerCase() + '_model']" type="text"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="" />
              <label :for="tabContent + '_model'"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {{ $t("Model") }}
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
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t("Default AI") }} </span>
              </label>
            </div>
            <div v-if="tabContent.toLowerCase() == 'gemini'">
              <div
                class="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
                role="alert">
                <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">{{ $t("Reminders") }}</span>
                <div>
                  <span class="font-medium">{{ $t("Reminder") }}</span> {{ $t("Gemini Reminder") }}
                </div>
              </div>
            </div>

          </div>
        </template>
      </div>

      <!-- 儲存按鈕 -->
      <div class="flex justify-center pt-6">
        <button @click="saveSettings"
          class="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
          💾 {{ $t("Save settings") }}
        </button>
      </div>

      <div class="mt-4 text-sm text-green-600 dark:text-green-300" v-if="defaultProvider">
        ✅ {{ $t("Current default AI:") }}<strong>{{ defaultProvider }}</strong>
      </div>

    </div>

    <div>
      <p v-if="isTextSelected" class="text-sm text-green-600">✅ {{ $t("isTextSelectedText") }}</p>
      <p v-else class="text-sm text-red-500">⚠️ {{ $t("isTextSelectedYetText") }}</p>
    </div>

    <textarea v-model="inputText"
      :placeholder="t('Please paste the text you want to polish or translate, or select a passage from the email.')"
      class="w-full h-40 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      @input="handleTextInput"></textarea>

    <div v-if="rtResult" class="p-4 border rounded-lg bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">🎯 {{ $t("Processing result:") }}</h2>
      <div class="whitespace-pre-line text-gray-800 pb-2">
        <Spinner v-if="isProcessing" />
        <p id="resultCopy" v-if="!isProcessing">{{ rtResult }}</p>
      </div>
      <ClipboardButton target-id="resultCopy" :default-text="t('Copy')" :success-text="t('Copied!')"
        :use-html-entities="true" content-type="innerHTML">
        <template #default>
          <!-- 自訂 default 圖示與文字 -->
        </template>
        <template #success>
          <!-- 自訂成功後的圖示與文字 -->
        </template>
      </ClipboardButton>

      <button ref="setSelectedBtn" @click="wrappedSetSelectedText"
        class="cursor-not-allowed text-gray-900 dark:text-gray-400 m-0.5 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border h-8"
        :disabled="rtResult === ''">
        <span class="inline-flex items-center">
          <svg class="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2"
              d="M14 4v3a1 1 0 0 1-1 1h-3m4 10v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2m11-3v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7.87a1 1 0 0 1 .24-.65l2.46-2.87a1 1 0 0 1 .76-.35H18a1 1 0 0 1 1 1Z" />
          </svg>

          <span class="text-xs font-semibold">{{ $t("Cover email selected text") }}</span>
        </span>
      </button>
    </div>

    <div class="flex gap-3">
      <button ref="getSelectedBtn" @click="wrappedGetSelectedText"
        class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="isTextSelected">
        {{ $t("Select text from the email") }}
      </button>

      <button ref="clearTextBtn" @click="wrappedSetClearText"
        class="cursor-not-allowed bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected">
        {{ $t("Clear") }}
      </button>
    </div>

    <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700">

    <div class="flex gap-3">

      <button ref="actionBtn" @click="wrappedHandleAction"
        class="cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        :disabled="!isTextSelected">
        {{ $t("Execute") }}
      </button>
    </div>


    <div class="flex justify-between items-center">
      <hr class="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
      <button @click="showOption = !showOption" type="button"
        class="w-1/5 cursor-pointer text-sm text-gray-600 hover:text-blue-600">

        {{ $t("Options") }}

        <span class="absolute mx-1 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"
            v-if="!showOption">
            <path fill-rule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clip-rule="evenodd" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"
            v-if="showOption">
            <path fill-rule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clip-rule="evenodd" />
          </svg>
        </span>

      </button>
    </div>


    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" v-if="showOption">
      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">{{ $t("Operating Mode") }}</label>
        <select v-model="mode" @change="changeTranslator"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="refine">{{ $t("Refine") }}</option>
          <option value="translate">{{ $t("Translation") }}</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">{{ $t("Use model") }}</label>
        <select v-model="defaultProvider"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <template v-for="provider in tabs" :key="provider">
            <option
              v-if="settings[provider.toLowerCase() + '_url'] !== '' && settings[provider.toLowerCase() + '_model'] !== ''"
              :value="provider.toLowerCase()">{{ provider }} ({{ $t("Local API") }})</option>
            <option
              v-else-if="providersList && providersList[provider.toLowerCase()].url !== '' && providersList[provider.toLowerCase()].model !== ''"
              :value="provider.toLowerCase()">{{ provider }} <template v-if="provider.toLowerCase() !== 'free'">({{
                $t("Cloud API") }})</template>
            </option>
            <option v-else :value="provider.toLowerCase()" disabled>{{ provider }} ({{ $t("Unset") }})
            </option>
          </template>

        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">{{ $t("Refine style") }}</label>
        <select v-model="style" :disabled="mode !== 'refine'"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">
          <option v-for="style in styles" :key="style" v-bind:value="style.value">
            {{ $t(style.text) }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 block mb-1">{{ $t("Translation language") }}</label>
        <select v-model="language" :disabled="mode === ''"
          class="w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100">

          <option v-for="language in languages" :key="language" v-bind:value="language.value">
            {{ $t(language.text) }}
          </option>

        </select>
      </div>
    </div>


  </div>
  <div class=" max-w-2xl mx-auto space-y-6">

    <div class="flex justify-between items-center gap-4">
      <div class="py-2 rounded w-auto">
        <span
          class="me-3 mb-3 md:mb-0 text-gray-300 font-mono font-semibold rounded-lg text-sm pl-5 py-2.5 text-center inline-flex items-center">©
          {{ rightsYear }}&nbsp<a href="https://refinerAI.com/" class="hover:text-gray-500">RefinerAI™</a>.</span>
      </div>
      <div class="py-2 rounded w-auto text-center">
        <span
          class="me-3 mb-3 md:mb-0 text-gray-300 font-mono font-semibold rounded-lg text-sm py-2.5 text-center inline-flex items-center">1.0.0</span>
      </div>
      <div class="py-2 rounded w-auto text-right ">
        <languageSelectorComponent bgColor="" shadowSize="" ringSize="" ringColor="" ringInset="" ringInsetColor="">
        </languageSelectorComponent>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useConfigStore } from 'stores/config';
import { useProviders } from 'apis/providers';
import { refineText, translateText } from "utils/aiClient";
import { useI18n } from 'vue-i18n'

import { replaceSelectedTextIfAny, fillSelectedTextToElement } from 'utils/outlookUtils';
import { showAlert } from 'utils/alerts';
import Spinner from "./components/Spinner.vue";
import Declaration from "./components/Declaration.vue";

/**
 *  初始區塊
 */
let providersList;
//t方法
const { t } = useI18n();
//初始定義
const tabs = ['OpenAI', 'Grok', 'Claude', 'Gemini', 'Customize', 'Free'] // API 提供者名稱
const providers = tabs.map(t => t.toLowerCase()); // 確保兩邊一致
const fields = ['url', 'key', 'model', 'default']; // API 設定的欄位名稱
const keys = providers.flatMap(p => fields.map(f => `${p}_${f}`)); // 生成 localStorage 的 key 名稱，如 openai_url、openai_key、openai_model
//const envKeys = providers.flatMap(p => fields.map(f => `${p.toUpperCase()}_API_${f.toUpperCase()}`)); // 生成環境變數的 key 名稱，如 VUE_APP_OPENAI_URL、VUE_APP_OPENAI_KEY、VUE_APP_OPENAI_MODEL

const languageGroups = {
  english: ['en_US', 'en_GB', 'en_CA', 'en_AU', 'en_NZ'],
  traditionalChinese: ['zh_TW', 'zh_HK', 'zh_MO'],
  simplifiedChinese: ['zh_CN', 'zh_SG']
};

const styles = [
  { text: "Formal", value: "formal" },
  { text: "Business", value: "business" },
  { text: "Creativity", value: "creativity" },
  { text: "Concise", value: "concise" },
  { text: "Humor", value: "humor" }
];

const languages = [
  { text: "English", value: "english" },
  { text: "Simplified Chinese", value: "simplified chinese" },
  { text: "Traditional Chinese", value: "traditional chinese" },
  { text: "Spanish", value: "spanish" },
  { text: "French", value: "french" },
  { text: "German", value: "german" },
  { text: "Japanese", value: "japanese" },
  { text: "Korean", value: "korean" },
  { text: "Russian", value: "russian" },
  { text: "Italian", value: "italian" },
  { text: "Portuguese", value: "portuguese" },
  { text: "Dutch", value: "dutch" },
  { text: "Arabic", value: "arabic" },
  { text: "Hindi", value: "hindi" },
  { text: "Bengali", value: "bengali" },
  { text: "Turkish", value: "turkish" },
  { text: "Vietnamese", value: "vietnamese" },
  { text: "Thai", value: "thai" },
  { text: "Swedish", value: "swedish" },
  { text: "Norwegian", value: "norwegian" },
  { text: "Danish", value: "danish" },
  { text: "Finnish", value: "finnish" },
  { text: "Polish", value: "polish" },
  { text: "Czech", value: "czech" },
  { text: "Hungarian", value: "hungarian" },
  { text: "Greek", value: "greek" },
  { text: "Hebrew", value: "hebrew" },
  { text: "Indonesian", value: "indonesian" },
  { text: "Malay", value: "malay" },
  { text: "Filipino", value: "filipino" },
  { text: "Ukrainian", value: "ukrainian" },
  { text: "Romanian", value: "romanian" },
  { text: "Bulgarian", value: "bulgarian" },
  { text: "Croatian", value: "croatian" },
  { text: "Serbian", value: "serbian" },
  { text: "Slovak", value: "slovak" },
  { text: "Slovenian", value: "slovenian" },
  { text: "Lithuanian", value: "lithuanian" },
  { text: "Latvian", value: "latvian" },
  { text: "Estonian", value: "estonian" },
  { text: "Persian", value: "persian" },
  { text: "Urdu", value: "urdu" },
  { text: "Swahili", value: "swahili" },
  { text: "Cantonese", value: "cantonese" },
  { text: "Tamil", value: "tamil" },
  { text: "Telugu", value: "telugu" },
  { text: "Marathi", value: "marathi" },
  { text: "Gujarati", value: "gujarati" },
  { text: "Punjabi", value: "punjabi" },
  { text: "Malayalam", value: "malayalam" },
  { text: "Kannada", value: "kannada" },
  { text: "Burmese", value: "burmese" },
  { text: "Khmer", value: "khmer" },
  { text: "Lao", value: "lao" },
  { text: "Amharic", value: "amharic" },
  { text: "Zulu", value: "zulu" },
  { text: "Xhosa", value: "xhosa" },
  { text: "Afrikaans", value: "afrikaans" },
  { text: "Hausa", value: "hausa" },
  { text: "Yoruba", value: "yoruba" },
  { text: "Igbo", value: "igbo" },
  { text: "Pashto", value: "pashto" },
  { text: "Kurdish", value: "kurdish" },
  { text: "Armenian", value: "armenian" },
  { text: "Georgian", value: "georgian" },
  { text: "Azerbaijani", value: "azerbaijani" },
  { text: "Kazakh", value: "kazakh" },
  { text: "Uzbek", value: "uzbek" },
  { text: "Mongolian", value: "mongolian" },
  { text: "Tibetan", value: "tibetan" },
  { text: "Nepali", value: "nepali" },
  { text: "Sinhalese", value: "sinhalese" },
  { text: "Fijian", value: "fijian" },
  { text: "Maori", value: "maori" },
  { text: "Samoan", value: "samoan" },
  { text: "Tongan", value: "tongan" }
];

// alert 狀態
const alertMessage = ref("");
//const alertType = ref("info"); // success | error | info

//預設值
const rightsYear = new Date().getFullYear();
const defaultProvider = ref('free');
const activeTab = ref('OpenAI') // 把 tab 名稱轉成 settings 的 key prefix（如 openai_url） const activeKey = computed(() => activeTab.value.toLowerCase())
const inputText = ref(""); // 使用者輸入的文字
const rtResult = ref(""); // API 回傳的結果
const style = ref("formal"); // 潤色風格
const language = ref("english"); // 翻譯語言
const mode = ref("refine"); // 操作模式（潤色或翻譯）
const isTextSelected = ref(false); // 是否有選取文字
const isProcessing = ref(false);
const showSettings = ref(false); // 是否顯示設定視窗
const showPassword = ref(false);
const showOption = ref(true);
const getSelectedBtn = ref(null)
const setSelectedBtn = ref(null)
const clearTextBtn = ref(null)
const actionBtn = ref(null)

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
    providersList = useProviders();
  }

  loadDefaultProvider();

  const browserLang = navigator.language.split('-')[0]
  const savedLang = localStorage.getItem('lang')
  const nowLang = savedLang || (['en_US', 'zh_CN', 'zh_TW'].includes(browserLang) ? browserLang : 'zh_TW');
  const group = getLanguageGroup(nowLang)

  changeLanguage(group);

});

// 監聽office.js 事件
Office.onReady(function (info) {

  if (info.host === null || info.platform === null) {
    showAlert(`⚠️ ${t("Office.js has not finished loading yet. Please try again later.")}`, 'error');
    return;
  }

  showAlert(`✅ ${t('readyEventsAlert', { host: info.host, platform: info.platform })}`, 'info');
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
/*
function showAlert(message, type = "info") {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = "";
  }, 3000);
}*/

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

  showAlert(`✅ ${t("The API settings have been saved.")}`, "success");
}

// 監聽 Button 變更
function seTextSelected(isSelected) {
  const buttons = [
    { el: getSelectedBtn.value, enabled: !isSelected },
    { el: clearTextBtn.value, enabled: isSelected },
    { el: actionBtn.value, enabled: isSelected },
  ]

  buttonStateChange(buttons);
}

// 監聽 Button 變更
function setResulted(isResulted) {
  const buttons = [
    { el: setSelectedBtn.value, enabled: isResulted && isResulted != "" },
  ]

  buttonStateChange(buttons);
}

function buttonStateChange(buttons) {
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

  if (!isTextSelected.value) rtResult.value = false;
}

// 清除文字
function setClearText() {
  if (isTextSelected.value) {
    inputText.value = "";
    isTextSelected.value = false;

    //變更button狀態        
    seTextSelected(isTextSelected.value);
    rtResult.value = false;
  }
}

function changeTranslator() {

  changeLanguage(getLanguageGroup(localStorage.getItem('lang')), mode.value)

}

function getLanguageGroup(locale) {
  for (const [group, locales] of Object.entries(languageGroups)) {
    if (locales.includes(locale)) {
      return group;
    }
  }
  return 'unknown';
}

function changeLanguage(group, mode = 'refine') {
  
  switch (mode) {
    case 'refine':
      switch (group) {
        case 'english':
          language.value = "english";
          break;
        case 'traditionalChinese':
          language.value = "traditional chinese";
          break;
        case 'simplifiedChinese':
          language.value = "simplified chinese";
          break;
        default:
          language.value = "english";
          break;
      }
      break;
    default:
      switch (group) {
        case 'english':
          language.value = "traditional chinese";
          break;
        case 'traditionalChinese':
          language.value = "english";
          break;
        case 'simplifiedChinese':
          language.value = "english";
          break;
        default:
          language.value = "traditional chinese";
          break;
      }
      break;
  }
}

// 覆蓋郵件選取文字
async function setSelectedText() {
  await replaceSelectedTextIfAny(
    rtResult.value,
    () => showAlert(`✅ ${t("The result has been overwritten on the selected text in the email.")}`, 'success'),
    () => showAlert(`⚠️ ${t("No result content, cannot be overwritten.")}`, 'warning'),
    (err) => showAlert(`${err.message}`, 'error')
  );
  /*
  if (!Office.context?.mailbox?.item) {
    showAlert(`⚠️ ${t("Outlook add-ins has not finished loading yet.")}`, "error");
    return;
  }

  if (rtResult.value) {
    if (Office.context?.mailbox?.item?.setSelectedDataAsync) {
      Office.context.mailbox.item.setSelectedDataAsync(rtResult.value, function (result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          showAlert(`✅ ${t("The result has been overwritten on the selected text in the email.")}`, "success");
        } else {
          showAlert(`❌ ${t("Unable to overwrite selected text in the email：${err.message}")}`, "error");
        }
      });
    } else {
      showAlert(`⚠️ ${t("Unable to use the overwrite feature. Please check the Outlook add-in environment.")}`, "error");
    }
  } else {
    showAlert(`⚠️ ${t("No result content, cannot be overwritten.")}`, "error");
  }*/

}

// 取得郵件選取文字
function getSelectedText() {

  fillSelectedTextToElement(
    inputText,
    () => {
      isTextSelected.value = inputText.value.trim().length > 0
      seTextSelected(isTextSelected.value);
      showAlert(`✅ ${t("Selected text has been loaded.")}`, 'success')
    },
    () => showAlert(`⚠️ ${t("No text selected or the selected area is empty.")}`, 'warning'),
    (err) => showAlert(`${err.message}`, 'error')
  );

  /*
  if (!Office.context?.mailbox?.item) {
    showAlert(`⚠️ ${t("Outlook add-ins has not finished loading yet.")}`, "error");
    return;
  }

  if (Office.context?.mailbox?.item?.getSelectedDataAsync) {
    Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const selectedText = result.value.data.trim();

        if (selectedText) {
          inputText.value = selectedText;
          isTextSelected.value = inputText.value.trim().length > 0;
          //變更button狀態
          seTextSelected(isTextSelected.value);
          showAlert(`✅ ${t("Selected text has been loaded.")}`, "success");
        } else {
          showAlert(`❌ ${t("No text selected or the selected area is empty.")}`, "error");
        }
      } else {
        showAlert(`❌ ${t("Unable to retrieve the selected text.")}`, "error");
      }
    });
  } else {
    showAlert(`⚠️ ${t("Unable to use the selection feature. Please check the Outlook add-in environment.")}`, "error");
  }
  */
}

// 處理文字
async function handleAction() {
  if (!isTextSelected.value) {
    showAlert(`⚠️ ${t("No text has been selected yet. Please select text from the email first.")}`, "error");
    return;
  }

  isProcessing.value = true;
  rtResult.value = `⏳ ${t("Processing...")}`;
  try {
    const textToProcess = inputText.value;
    if (mode.value === "refine") {
      rtResult.value = await refineText(providersList, defaultProvider.value, textToProcess, style.value, language.value);
    } else if (mode.value === "translate") {
      rtResult.value = await translateText(providersList, defaultProvider.value, textToProcess, language.value);
    }

    setResulted(rtResult);

    isProcessing.value = false;
  } catch (err) {
    console.error(err);
    rtResult.value = `❌ ${t("An error occurred, please check the API settings or the input content.")}`;
  }
}


</script>

<style scoped>
textarea {
  resize: none;
}
</style>
