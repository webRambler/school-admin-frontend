import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  College,
  CollegeCreateRequest,
  CollegeUpdateRequest,
  CollegeWithClassesVO,
} from '../types'

export const collegeApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<College>>>('/colleges', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<College>>(`/colleges/${id}`),
  search: (name: string) =>
    request.get<unknown, ApiResult<College[]>>('/colleges/search', { params: { name } }),
  getByCode: (code: string) =>
    request.get<unknown, ApiResult<College>>(`/colleges/code/${code}`),
  create: (data: CollegeCreateRequest) =>
    request.post<unknown, ApiResult<College>>('/colleges', data),
  update: (id: number, data: CollegeUpdateRequest) =>
    request.put<unknown, ApiResult<College>>(`/colleges/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/colleges/${id}`),
  classCount: (id: number) =>
    request.get<unknown, ApiResult<number>>(`/colleges/${id}/class-count`),
  statistics: (id: number) =>
    request.get<unknown, ApiResult<CollegeWithClassesVO>>(`/colleges/${id}/statistics`),
}
