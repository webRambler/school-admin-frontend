import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  Teacher,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from '../types'

export const teacherApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<Teacher>>>('/teachers', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<Teacher>>(`/teachers/${id}`),
  search: (params: unknown) =>
    request.get<unknown, ApiResult<Teacher[]>>('/teachers/search', { params }),
  listByDepartment: (department: string) =>
    request.get<unknown, ApiResult<Teacher[]>>(`/teachers/department/${department}`),
  listByTitle: (title: string) =>
    request.get<unknown, ApiResult<Teacher[]>>(`/teachers/title/${title}`),
  create: (data: TeacherCreateRequest) =>
    request.post<unknown, ApiResult<Teacher>>('/teachers', data),
  update: (id: number, data: TeacherUpdateRequest) =>
    request.put<unknown, ApiResult<Teacher>>(`/teachers/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/teachers/${id}`),
}
