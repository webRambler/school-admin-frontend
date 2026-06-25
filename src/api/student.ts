import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  Student,
  StudentCreateRequest,
  StudentUpdateRequest,
  StudentWithClassVO,
  StudentCourseScoreVO,
} from '../types'

/** listWithClass 支持的查询参数 */
export interface StudentListParams extends PageParams {
  name?: string
  gender?: string
  className?: string
}

export const studentApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<Student>>>('/students', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<Student>>(`/students/${id}`),
  search: (name: string) =>
    request.get<unknown, ApiResult<Student[]>>('/students/search', { params: { name } }),
  listByClassId: (classId: number) =>
    request.get<unknown, ApiResult<Student[]>>(`/students/class/${classId}`),
  listByGender: (gender: string) =>
    request.get<unknown, ApiResult<Student[]>>(`/students/gender/${gender}`),
  create: (data: StudentCreateRequest) =>
    request.post<unknown, ApiResult<Student>>('/students', data),
  update: (id: number, data: StudentUpdateRequest) =>
    request.put<unknown, ApiResult<Student>>(`/students/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/students/${id}`),
  getWithClass: (id: number) =>
    request.get<unknown, ApiResult<StudentWithClassVO>>(`/students/${id}/with-class`),
  listWithClassByClassId: (classId: number) =>
    request.get<unknown, ApiResult<StudentWithClassVO[]>>(`/students/class/${classId}/with-class`),
  listWithClass: (params?: StudentListParams) =>
    request.get<unknown, ApiResult<PageResult<StudentWithClassVO>>>('/students/with-class', { params }),
  getCourseScores: (id: number) =>
    request.get<unknown, ApiResult<StudentCourseScoreVO[]>>(`/students/${id}/courses-scores`),
  countCourses: (id: number) =>
    request.get<unknown, ApiResult<number>>(`/students/${id}/course-count`),
  listWithCondition: (params: Record<string, unknown>) =>
    request.get<unknown, ApiResult<StudentWithClassVO[]>>('/students/search/condition', { params }),
}
