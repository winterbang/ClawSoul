/**
 * 剪贴板辅助函数
 */

/**
 * 复制文本到剪贴板
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  // 尝试使用现代 API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.log('Clipboard API failed, trying fallback')
    }
  }
  
  // 降级方案：使用 textarea 复制
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    
    return successful
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}

/**
 * 视图与预览标签的映射
 * @type {Object.<string, string>}
 */
export const VIEW_TO_PREVIEW_MAP = {
  identity: 'identity',
  soul: 'soul',
  agents: 'agents',
  user: 'user',
  memory: 'memory',
  skills: 'skills'
}

/**
 * 同步视图和预览标签
 * @param {string} view
 * @returns {string|null}
 */
export function getPreviewTabByView(view) {
  return VIEW_TO_PREVIEW_MAP[view] || null
}
