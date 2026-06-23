import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/auth'
import type { LoginVO } from '../types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  username: string | null
  nickname: string | null
  login: (username: string, password: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => Promise<void>
  setAuth: (accessToken: string, refreshToken: string, username: string, nickname: string) => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      nickname: null,

      login: async (username: string, password: string) => {
        const res = await authApi.login({ username, password })
        const data = res.data as LoginVO
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          username: data.username,
          nickname: data.nickname,
        })
      },

      refresh: async () => {
        const res = await authApi.refresh()
        const data = res.data as LoginVO
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          username: data.username,
          nickname: data.nickname,
        })
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // ignore
        }
        set({
          accessToken: null,
          refreshToken: null,
          username: null,
          nickname: null,
        })
      },

      setAuth: (accessToken: string, refreshToken: string, username: string, nickname: string) => {
        set({ accessToken, refreshToken, username, nickname })
      },

      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'school-auth',
    }
  )
)
