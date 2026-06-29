/** 后端统一响应结构 */
export interface ApiResult<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PageResult<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

/** 分页请求参数 */
export interface PageParams {
  pageNum?: number
  pageSize?: number
}

// ============ 实体类型 ============

export interface College {
  id: number
  name: string
  code: string
  description: string
  dean: string
  phone: string
  createTime: string
  updateTime: string
}

export interface ClassRoom {
  id: number
  collegeId: number
  name: string
  grade: string
  major: string
  teacher: string
  createTime: string
  updateTime: string
}

export interface Student {
  id: number
  name: string
  gender: string
  age: number
  classId: number
  phone: string
  email: string
  createTime: string
  updateTime: string
}

export interface Teacher {
  id: number
  collegeId: number
  name: string
  gender: string
  age: number
  title: string
  phone: string
  email: string
  createTime: string
  updateTime: string
}

export interface Course {
  id: number
  teacherId: number
  name: string
  credit: number
  hours: number
  semester: string
  createTime: string
  updateTime: string
}

export interface Score {
  id: number
  studentId: number
  courseId: number
  score: number
  examType: string
  createTime: string
  updateTime: string
}

export interface User {
  id: number
  username: string
  password: string
  nickname: string
  createTime: string
  updateTime: string
}

// ============ VO 类型 ============

export interface LoginVO {
  accessToken: string
  refreshToken: string
  username: string
  nickname: string
}

export interface ScoreDetailVO {
  scoreId: number
  score: number
  examType: string
  scoreCreateTime: string
  studentId: number
  studentName: string
  gender: string
  phone: string
  courseId: number
  courseName: string
  credit: number
  hours: number
}

export interface StudentWithClassVO {
  id: number
  name: string
  gender: string
  age: number
  classId: number
  phone: string
  email: string
  createTime: string
  updateTime: string
  className: string
  grade: string
  major: string
  teacher: string
}

export interface ClassRoomStatisticsVO {
  classId: number
  className: string
  grade: string
  major: string
  studentCount: number
  avgScore: number
  maxScore: number
  minScore: number
  passCount: number
  passRate: number
}

export interface CourseStatisticsVO {
  courseId: number
  courseName: string
  credit: number
  studentCount: number
  avgScore: number
  maxScore: number
  minScore: number
  passCount: number
  passRate: number
}

export interface CollegeWithClassesVO {
  collegeId: number
  collegeName: string
  collegeCode: string
  description: string
  dean: string
  phone: string
  createTime: string
  classCount: number
  studentCount: number
}

export interface ScoreRankVO {
  rank: number
  studentId: number
  studentName: string
  className: string
  score: number
}

export interface StudentCourseScoreVO {
  scoreId: number
  score: number
  examType: string
  scoreCreateTime: string
  courseId: number
  courseName: string
  credit: number
  hours: number
  semester: string
}

// ============ DTO 类型 ============

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  nickname?: string
}

export interface CollegeCreateRequest {
  name: string
  code: string
  description?: string
  deanId?: string
  phone?: string
}

export interface CollegeUpdateRequest {
  name?: string
  code?: string
  description?: string
  deanId?: string
  phone?: string
}

export interface ClassRoomCreateRequest {
  collegeId: number
  name: string
  grade: string
  major: string
  teacher?: string
}

export interface ClassRoomUpdateRequest {
  collegeId?: number
  name?: string
  grade?: string
  major?: string
  teacher?: string
}

export interface StudentCreateRequest {
  name: string
  gender: string
  age: number
  classId: number
  phone?: string
  email?: string
}

export interface StudentUpdateRequest {
  name?: string
  gender?: string
  age?: number
  classId?: number
  phone?: string
  email?: string
}

export interface TeacherCreateRequest {
  collegeId: number
  name: string
  gender: string
  age: number
  title?: string
  phone?: string
  email?: string
}

export interface TeacherUpdateRequest {
  collegeId?: number
  name?: string
  gender?: string
  age?: number
  title?: string
  phone?: string
  email?: string
}

export interface CourseCreateRequest {
  teacherId: number
  name: string
  credit: number
  hours: number
  semester?: string
}

export interface CourseUpdateRequest {
  teacherId?: number
  name?: string
  credit?: number
  hours?: number
  semester?: string
}

export interface ScoreCreateRequest {
  studentId: number
  courseId: number
  score: number
  examType: string
}

export interface ScoreUpdateRequest {
  score?: number
  examType?: string
}
