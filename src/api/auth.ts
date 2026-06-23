import request from '../utils/request'
import type { ApiResult, LoginRequest, LoginVO, RegisterRequest } from '../types'

export const authApi = {
  login: (data: LoginRequest) =>
    request.post<unknown, ApiResult<LoginVO>>('/auth/login', data),
  register: (data: RegisterRequest) =>
    request.post<unknown, ApiResult<LoginVO>>('/auth/register', data),
  refresh: () =>
    request.post<unknown, ApiResult<LoginVO>>('/auth/refresh'),
  logout: () =>
    request.post<unknown, ApiResult<void>>('/auth/logout'),
}
