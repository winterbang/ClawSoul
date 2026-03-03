import { reactive } from 'vue'

/**
 * Toast 提示 Composable
 * @returns {{
 *   toast: import('vue').UnwrapNestedRefs<import('../types').ToastState>,
 *   showToast: (message: string, duration?: number) => void,
 *   hideToast: () => void
 * }}
 */
export function useToast() {
  const toast = reactive({
    show: false,
    message: ''
  })

  let hideTimer = null

  /**
   * 显示 Toast
   * @param {string} message
   * @param {number} [duration=3000]
   */
  const showToast = (message, duration = 3000) => {
    toast.message = message
    toast.show = true
    
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
    
    hideTimer = setTimeout(() => {
      toast.show = false
    }, duration)
  }

  /**
   * 隐藏 Toast
   */
  const hideToast = () => {
    toast.show = false
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
  }

  return {
    toast,
    showToast,
    hideToast
  }
}
