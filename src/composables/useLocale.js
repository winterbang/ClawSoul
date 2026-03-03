import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const LOCALE_KEY = 'clawsoul-locale'
const currentLocale = ref('zh')

export function useLocale() {
  const { locale } = useI18n()

  const setLocale = (lang) => {
    currentLocale.value = lang
    locale.value = lang
    localStorage.setItem(LOCALE_KEY, lang)
    document.documentElement.setAttribute('lang', lang)
  }

  const toggleLocale = () => {
    const newLocale = currentLocale.value === 'zh' ? 'en' : 'zh'
    setLocale(newLocale)
  }

  const initLocale = () => {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved) {
      setLocale(saved)
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('en')) {
        setLocale('en')
      } else {
        setLocale('zh')
      }
    }
  }

  onMounted(() => {
    initLocale()
  })

  return {
    currentLocale,
    setLocale,
    toggleLocale,
    isZh: computed(() => currentLocale.value === 'zh'),
    isEn: computed(() => currentLocale.value === 'en')
  }
}
