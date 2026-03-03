/**
 * 格式化辅助函数
 */

/**
 * 格式化日期
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0]
}

/**
 * 格式化时间为 HH:mm
 * @param {string} time
 * @returns {string}
 */
export function formatTime(time) {
  return time || '00:00'
}

/**
 * 将数组格式化为 Markdown 列表
 * @param {string[]} items
 * @param {string} prefix
 * @returns {string}
 */
export function formatMarkdownList(items, prefix = '- ') {
  return items.filter(Boolean).map(item => `${prefix}${item}`).join('\n')
}

/**
 * 将数组格式化为 Markdown 有序列表
 * @param {string[]} items
 * @returns {string}
 */
export function formatMarkdownNumberedList(items) {
  return items.filter(Boolean).map((item, i) => `${i + 1}. ${item}`).join('\n')
}

/**
 * 截断文本
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
