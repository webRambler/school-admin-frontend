import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  ClassRoom,
  ClassRoomCreateRequest,
  ClassRoomUpdateRequest,
  ClassRoomStatisticsVO,
} from '../types'

export const classRoomApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<ClassRoom>>>('/classrooms', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<ClassRoom>>(`/classrooms/${id}`),
  search: (name: string) =>
    request.get<unknown, ApiResult<ClassRoom[]>>('/classrooms/search', { params: { name } }),
  listByGrade: (grade: string) =>
    request.get<unknown, ApiResult<ClassRoom[]>>(`/classrooms/grade/${grade}`),
  listByMajor: (major: string) =>
    request.get<unknown, ApiResult<ClassRoom[]>>(`/classrooms/major/${major}`),
  create: (data: ClassRoomCreateRequest) =>
    request.post<unknown, ApiResult<ClassRoom>>('/classrooms', data),
  update: (id: number, data: ClassRoomUpdateRequest) =>
    request.put<unknown, ApiResult<ClassRoom>>(`/classrooms/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/classrooms/${id}`),
  studentCount: (id: number) =>
    request.get<unknown, ApiResult<number>>(`/classrooms/${id}/student-count`),
  statistics: (id: number) =>
    request.get<unknown, ApiResult<ClassRoomStatisticsVO>>(`/classrooms/${id}/statistics`),
}
