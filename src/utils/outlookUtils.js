// src/utils/outlookUtils.js
import i18n from 'i18n'
const { t } = i18n.global;
/**
 * 確保 Outlook 增益集已就緒
 */
function isOutlookReady() {
  return typeof Office !== 'undefined' &&
    Office.context?.mailbox?.item != null;
}

/**
 * 取得目前選取的文字內容
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
 * 替換目前選取的文字（僅在有選取時執行）
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
 * 若有選取文字，則執行替換；否則觸發回呼
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
 * 取得選取內容並設至指定輸入元素
 * @param {HTMLElement|string} targetElement - 可接受文字的 DOM 元素或其選擇器
 * @param {Function} [onSuccess] - 成功設值後的回呼
 * @param {Function} [onEmpty] - 若無選取內容的回呼
 * @param {Function} [onError] - 錯誤時的回呼
 * @param {Function} [afterAll] - 無論成功與否都會執行的回呼
 */
export async function fillSelectedTextToElement(targetElement, onSuccess, onEmpty, onError, afterAll) {
  try {
    const text = await getSelectedText();

    if (!text) {
      onEmpty?.();
      return;
    }

    let el = typeof targetElement === 'string'
      ? document.querySelector(targetElement)
      : targetElement;

    if (!el || !(el instanceof HTMLElement)) {
      throw new Error(`❌ ${t('Cannot find the element to copy')}`);
    }

    if ('value' in el) {
      el.value = text;
    } else {
      el.textContent = text;
    }

    onSuccess?.(text, el);
  } catch (error) {
    console.error('[fillSelectedTextToElement] Error:', error);
    onError?.(error);
  } finally {
    afterAll?.();
  }
}