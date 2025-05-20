// src/utils/outlookUtils.js
import i18n from 'i18n'
import { ref } from 'vue';
const { t } = i18n.global;
const mode = ref('');
/**
 * 確保 Outlook 增益集已就緒
 */
function isOutlookReady() {
  return typeof Office !== 'undefined' &&
    Office.context?.mailbox?.item != null;
}

/**
 * 獲取 Outlook 當前模式
 */
export async function getModeContent() {
  return new Promise((resolve, reject) => {
    if (!isOutlookReady()) {
      return reject(new Error(`⚠️ ${t("Outlook add-ins has not finished loading yet.")}`));
    }

    if (Office.context?.mailbox?.item?.itemType === Office.MailboxEnums?.ItemType?.Message) {
      if (Office.context?.mailbox?.item?.body && typeof Office.context?.mailbox?.item?.body?.setAsync === 'function') {
        mode.value = 'compose'

      } else {
        mode.value = 'read'

      }

    } else {
      mode.value = 'unKnown';
    }

    if (mode.value && mode.value != 'unKnown') {
      resolve(mode.value);
    } else {
      reject(mode.value);
    }

  });
}

/**
 * 讀取模式:取得目前選取的文字內容
 */
export async function getReadSelectedText() {
  return new Promise((resolve, reject) => {
    if (!isOutlookReady()) {
      return reject(new Error(`⚠️ ${t("Outlook add-ins has not finished loading yet.")}`));
    }

    if (Office.context?.mailbox?.item?.body?.getAsync) {
      // 獲取選取的文字
      Office.context.mailbox.item.body.getAsync('html', (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve(result.value.trim());
        } else {
          reject(result.error || new Error(`❌ ${t("No text selected or the selected area is empty.")}`));
        }
      })
    } else {
      return reject(new Error(`⚠️ ${t("Unable to use the selection feature. Please check the Outlook add-in environment.")}`));
    }
  });
}

/**
 * 撰寫模式:取得目前選取的文字內容
 * @returns {Promise<string>} - 若沒有選取內容，則回傳空字串
 */
export async function getSelectedText() {
  return new Promise((resolve, reject) => {
    if (!isOutlookReady()) {
      return reject(new Error(`⚠️ ${t("Outlook add-ins has not finished loading yet.")}`));
    }

    if (Office.context?.mailbox?.item?.getSelectedDataAsync) {
      Office.context.mailbox.item.getSelectedDataAsync(
        Office.CoercionType.Text,
        (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(result.value?.data?.trim() || '');
          } else {
            reject(result.error || new Error(`❌ ${t("No text selected or the selected area is empty.")}`));
          }
        }
      );
    } else {
      return reject(new Error(`⚠️ ${t("Unable to use the selection feature. Please check the Outlook add-in environment.")}`));
    }
  });
}

/**
 * 撰寫模式:替換目前選取的文字（僅在有選取時執行）
 * @param {string} newText - 要替換成的內容
 * @returns {Promise<boolean>} - 是否成功替換
 */
export async function replaceSelectedText(newText) {
  return new Promise((resolve, reject) => {
    if (!isOutlookReady()) {
      return reject(new Error(`❌ ${t("No text selected or the selected area is empty.")}`));
    }

    if (Office.context?.mailbox?.item?.setSelectedDataAsync) {
      Office.context.mailbox.item.setSelectedDataAsync(
        newText,
        { coercionType: Office.CoercionType.Text },
        (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(true);
          } else {
            reject(result.error || new Error(`❌ ${t("Unable to overwrite selected text in the email.")}`));
          }
        }
      );
    } else {
      return reject(new Error(`⚠️ ${t("Unable to use the overwrite feature. Please check the Outlook add-in environment.")}`));
    }
  });
}

/**
 * 撰寫模式:若有選取文字，則執行替換；否則觸發回呼
 * @param {string} newText - 要替換的新文字
 * @param {Function} onSuccess - 成功回呼
 * @param {Function} onEmpty - 無選取內容時的回呼
 * @param {Function} onError - 錯誤時的回呼
 */
export async function replaceSelectedTextIfAny(newText, onSuccess, onEmpty, onError) {
  try {
    const selectedText = await getSelectedText();
    if (!selectedText) {
      onEmpty?.();
      return;
    }

    await replaceSelectedText(newText);
    onSuccess?.();
  } catch (error) {
    console.error('[replaceSelectedTextIfAny] Error:', error);
    onError?.(error);
  }
}

/**
 * 撰寫模式:取得選取內容並設至指定輸入元素
 * @param {Ref|string|HTMLElement} target - 可為 Vue ref, selector 字串, 或 DOM 元素
 * @param {Function} [onSuccess] - 成功設值後的回呼
 * @param {Function} [onEmpty] - 若無選取內容的回呼
 * @param {Function} [onError] - 錯誤時的回呼
 * @param {Function} [afterAll] - 無論成功與否都會執行的回呼
 */
export async function fillSelectedTextToElement(target, onSuccess, onEmpty, onError, afterAll) {
  try {

    const mode = await getModeContent();

    const text = mode == "compose" ? await getSelectedText() : await getReadSelectedText();

    if (!text) {
      onEmpty?.();
      return;
    }

    // ✅ Vue ref (v-model)
    if (target && typeof target === 'object' && 'value' in target) {
      target.value = text;
      onSuccess?.();
      return;
    }

    // ✅ Selector string
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        applyTextToElement(el, text);
        onSuccess?.();
      } else {
        throw new Error(`無法找到元素：${target}`);
      }
      return;
    }

    // ✅ DOM Element 物件
    if (target instanceof HTMLElement) {
      applyTextToElement(target, text);
      onSuccess?.();
      return;
    }

    throw new Error('無效的 target 類型');

    onSuccess?.(text, el);
  } catch (error) {
    console.error('[fillSelectedTextToElement] Error:', error);
    onError?.(error);
  } finally {
    afterAll?.();
  }
}