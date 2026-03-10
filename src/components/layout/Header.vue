<!-- Header.vue -->
<template>
  <header class="border-b border-[var(--border-color)] glass sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="logo" class="w-10 h-10 rounded-lg object-cover ghost-float" />
        <div>
          <h1 class="text-xl font-bold neon-text">{{ $t('header.title') }}</h1>
          <p class="text-xs text-[var(--text-secondary)]">{{ $t('header.subtitle') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- 语言切换按钮 -->
        <button
          @click="toggleLocale"
          class="cyber-btn-secondary text-sm p-2"
          :title="isZh ? 'Switch to English' : '切换到中文'"
        >
          <span class="text-xs font-medium">{{ currentLocale === 'zh' ? '中' : 'En' }}</span>
        </button>

        <!-- 主题切换按钮 -->
        <button
          @click="toggleTheme"
          class="cyber-btn-secondary text-sm p-2"
          :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        >
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>
        
        <a 
          href="https://openclaw.ai" 
          target="_blank"
          class="cyber-btn-secondary text-sm"
          title="OpenClaw"
        >
          <OpenClawLogo class="w-5 h-5" />
          <span class="hidden sm:inline">{{ $t('header.official') }}</span>
        </a>
        <a 
          href="https://docs.openclaw.ai" 
          target="_blank"
          class="cyber-btn-secondary text-sm"
          title="Documentation"
        >
          <OpenClawLogo class="w-5 h-5" />
          <span class="hidden sm:inline">{{ $t('header.docs') }}</span>
        </a>

        <!-- 认证按钮 -->
        <template v-if="isAuthenticated">
          <div class="flex items-center gap-2">
            <span class="text-sm text-[var(--text-secondary)] hidden sm:inline">{{ user?.email }}</span>
            <button
              @click="signOut"
              class="cyber-btn-secondary text-sm p-2"
              :title="$t('auth.logout')"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </template>
        <template v-else>
          <!-- 登录/注册下拉菜单 -->
          <div class="relative group">
            <button
              class="cyber-btn-primary text-sm flex items-center gap-1 px-3 py-1.5"
            >
              <User class="w-4 h-4" />
              <span class="hidden sm:inline">{{ $t('auth.login') }}</span>
            </button>
            <!-- 下拉菜单 -->
            <div class="absolute right-0 top-full mt-2 w-40 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <button
                @click="handleLogin('google')"
                class="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                @click="handleLogin('github')"
                class="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Sun, Moon, User, LogOut } from 'lucide-vue-next'
import OpenClawLogo from '../ui/OpenClawLogo.vue'
import { useTheme } from '../../composables/useTheme.js'
import { useLocale } from '../../composables/useLocale.js'
import { useAuth } from '../../composables/useAuth.js'

const { isDark, toggleTheme } = useTheme()
const { currentLocale, toggleLocale, isZh } = useLocale()
const { user, isAuthenticated, signInWithGoogle, signInWithGithub, signOut } = useAuth()

const handleLogin = async (provider) => {
  if (provider === 'google') {
    await signInWithGoogle()
  } else if (provider === 'github') {
    await signInWithGithub()
  }
}
</script>

<style scoped>
/* 幽灵飘浮动画 - 带发光跟随 */
@keyframes ghostFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    filter: drop-shadow(2px 2px 12px rgba(0, 212, 255, 0.4)) 
            drop-shadow(-1px -1px 8px rgba(168, 85, 247, 0.3));
  }
  15% {
    transform: translate(3px, -4px) rotate(1deg);
    filter: drop-shadow(5px 1px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(-2px -5px 10px rgba(168, 85, 247, 0.4));
  }
  30% {
    transform: translate(-2px, -6px) rotate(-1deg);
    filter: drop-shadow(0px 4px 16px rgba(0, 212, 255, 0.6)) 
            drop-shadow(2px -6px 12px rgba(168, 85, 247, 0.5));
  }
  45% {
    transform: translate(-4px, -2px) rotate(0.5deg);
    filter: drop-shadow(-3px 2px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(4px -3px 10px rgba(168, 85, 247, 0.4));
  }
  60% {
    transform: translate(-1px, 3px) rotate(-0.5deg);
    filter: drop-shadow(-2px 6px 12px rgba(0, 212, 255, 0.45)) 
            drop-shadow(1px 4px 8px rgba(168, 85, 247, 0.35));
  }
  75% {
    transform: translate(3px, 2px) rotate(1deg);
    filter: drop-shadow(5px 4px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(-3px 2px 10px rgba(168, 85, 247, 0.4));
  }
  90% {
    transform: translate(2px, -1px) rotate(-0.5deg);
    filter: drop-shadow(4px 0px 12px rgba(0, 212, 255, 0.45)) 
            drop-shadow(-2px -2px 8px rgba(168, 85, 247, 0.35));
  }
}

.ghost-float {
  animation: ghostFloat 6s ease-in-out infinite;
}

.ghost-float:hover {
  animation-duration: 3s;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8)) 
          drop-shadow(0 0 30px rgba(168, 85, 247, 0.6)) !important;
}

/* 浅色主题 - 红光发光效果 */
:global([data-theme="light"]) .ghost-float {
  animation-name: ghostFloatLight;
}

:global([data-theme="light"]) .ghost-float:hover {
  filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8)) 
          drop-shadow(0 0 30px rgba(220, 38, 38, 0.6)) !important;
}

@keyframes ghostFloatLight {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    filter: drop-shadow(2px 2px 12px rgba(239, 68, 68, 0.4)) 
            drop-shadow(-1px -1px 8px rgba(220, 38, 38, 0.3));
  }
  15% {
    transform: translate(3px, -4px) rotate(1deg);
    filter: drop-shadow(5px 1px 14px rgba(239, 68, 68, 0.5)) 
            drop-shadow(-2px -5px 10px rgba(220, 38, 38, 0.4));
  }
  30% {
    transform: translate(-2px, -6px) rotate(-1deg);
    filter: drop-shadow(0px 4px 16px rgba(239, 68, 68, 0.6)) 
            drop-shadow(2px -6px 12px rgba(220, 38, 38, 0.5));
  }
  45% {
    transform: translate(-4px, -2px) rotate(0.5deg);
    filter: drop-shadow(-3px 2px 14px rgba(239, 68, 68, 0.5)) 
            drop-shadow(4px -3px 10px rgba(220, 38, 38, 0.4));
  }
  60% {
    transform: translate(-1px, 3px) rotate(-0.5deg);
    filter: drop-shadow(-2px 6px 12px rgba(239, 68, 68, 0.45)) 
            drop-shadow(1px 4px 8px rgba(220, 38, 38, 0.35));
  }
  75% {
    transform: translate(3px, 2px) rotate(1deg);
    filter: drop-shadow(5px 4px 14px rgba(239, 68, 68, 0.5)) 
            drop-shadow(-3px 2px 10px rgba(220, 38, 38, 0.4));
  }
  90% {
    transform: translate(2px, -1px) rotate(-0.5deg);
    filter: drop-shadow(4px 0px 12px rgba(239, 68, 68, 0.45)) 
            drop-shadow(-2px -2px 8px rgba(220, 38, 38, 0.35));
  }
}
</style>