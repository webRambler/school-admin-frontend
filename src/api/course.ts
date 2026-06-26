import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseStatisticsVO,
} from '../types'

export const courseApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<Course>>>('/courses', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<Course>>(`/courses/${id}`),
  search: (params: object) =>
    request.get<unknown, ApiResult<PageResult<Course>>>('/courses/search', { params }),
  listByCredit: (credit: number) =>
    request.get<unknown, ApiResult<Course[]>>(`/courses/credit/${credit}`),
  listBySemester: (semester: string) =>
    request.get<unknown, ApiResult<Course[]>>(`/courses/semester/${semester}`),
  create: (data: CourseCreateRequest) =>
    request.post<unknown, ApiResult<Course>>('/courses', data),
  update: (id: number, data: CourseUpdateRequest) =>
    request.put<unknown, ApiResult<Course>>(`/courses/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/courses/${id}`),
  statistics: (id: number) =>
    request.get<unknown, ApiResult<CourseStatisticsVO>>(`/courses/${id}/statistics`),
}
