import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-react'
import { useAuthStore } from '../store/auth'
import type { ApiResult } from '../types'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ============ 请求去重 ============
const pendingRequestMap = new Map<string, AbortController>()

function getRequestKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

function addPendingRequest(config: InternalAxiosRequestConfig): void {
  const key = getRequestKey(config)
  if (pendingRequestMap.has(key)) {
    // 取消之前的重复请求
    const controller = pendingRequestMap.get(key)!
    controller.abort()
    pendingRequestMap.delete(key)
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequestMap.set(key, controller)
}

function removePendingRequest(config: AxiosRequestConfig): void {
  const key = getRequestKey(config)
  pendingRequestMap.delete(key)
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加请求去重
    addPendingRequest(config)

    const { accessToken, refreshToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    if (config.url === '/auth/refresh' && refreshToken) {
      config.headers['Refresh-Token'] = refreshToken
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let pendingRequests: ((failed?: boolean) => void)[] = []

function onRefreshed() {
  pendingRequests.forEach((cb) => cb())
  pendingRequests = []
}

function onRefreshFailed() {
  pendingRequests.forEach((cb) => cb(true))
  pendingRequests = []
}

// 响应拦截器：解包 ApiResult，直接返回 data 部分
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成，移除待处理记录
    removePendingRequest(response.config)

    const res = response.data as ApiResult
    if (res.code !== 200) {
      Message.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败')) as never
    }
    return res as never
  },
  async (error) => {
    // 请求完成（无论成功失败），移除待处理记录
    if (error.config) {
      removePendingRequest(error.config)
    }

    // 如果是被取消的请求，不显示错误提示
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      const { refreshToken, refresh, logout } = useAuthStore.getState()

      if (!refreshToken) {
        logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((failed) => {
            if (failed) reject(error)
            else resolve(request(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await refresh()
        onRefreshed()
        return request(originalRequest)
      } catch {
        onRefreshFailed()
        logout()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const msg = error.response?.data?.message || error.message || '网络错误'
    Message.error(msg)
    return Promise.reject(error)
  }
)

export default request
