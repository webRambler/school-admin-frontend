import request from '../utils/request'
import type {
  ApiResult,
  PageResult,
  PageParams,
  Score,
  ScoreCreateRequest,
  ScoreUpdateRequest,
  ScoreDetailVO,
  ScoreRankVO,
} from '../types'

export const scoreApi = {
  list: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<Score>>>('/scores', { params }),
  getById: (id: number) =>
    request.get<unknown, ApiResult<Score>>(`/scores/${id}`),
  listByStudentId: (studentId: number) =>
    request.get<unknown, ApiResult<Score[]>>(`/scores/student/${studentId}`),
  listByCourseId: (courseId: number) =>
    request.get<unknown, ApiResult<Score[]>>(`/scores/course/${courseId}`),
  getByStudentAndCourse: (studentId: number, courseId: number) =>
    request.get<unknown, ApiResult<Score>>(`/scores/student/${studentId}/course/${courseId}`),
  listByExamType: (examType: string) =>
    request.get<unknown, ApiResult<Score[]>>(`/scores/exam-type/${examType}`),
  listFailed: () =>
    request.get<unknown, ApiResult<Score[]>>('/scores/failed'),
  create: (data: ScoreCreateRequest) =>
    request.post<unknown, ApiResult<Score>>('/scores', data),
  update: (id: number, data: ScoreUpdateRequest) =>
    request.put<unknown, ApiResult<Score>>(`/scores/${id}`, data),
  delete: (id: number) =>
    request.delete<unknown, ApiResult<void>>(`/scores/${id}`),
  getDetail: (id: number) =>
    request.get<unknown, ApiResult<ScoreDetailVO>>(`/scores/${id}/detail`),
  listDetailByStudentId: (studentId: number) =>
    request.get<unknown, ApiResult<ScoreDetailVO[]>>(`/scores/student/${studentId}/detail`),
  listDetailByCourseId: (courseId: number) =>
    request.get<unknown, ApiResult<ScoreDetailVO[]>>(`/scores/course/${courseId}/detail`),
  listDetail: (params?: PageParams) =>
    request.get<unknown, ApiResult<PageResult<ScoreDetailVO>>>('/scores/detail', { params }),
  listFailedDetail: () =>
    request.get<unknown, ApiResult<ScoreDetailVO[]>>('/scores/failed/detail'),
  listDetailByExamType: (examType: string) =>
    request.get<unknown, ApiResult<ScoreDetailVO[]>>(`/scores/exam-type/${examType}/detail`),
  rankingByCourse: (courseId: number) =>
    request.get<unknown, ApiResult<ScoreRankVO[]>>(`/scores/ranking/course/${courseId}`),
  rankingByClassAndCourse: (classId: number, courseId: number) =>
    request.get<unknown, ApiResult<ScoreRankVO[]>>(`/scores/ranking/class/${classId}/course/${courseId}`),
}
