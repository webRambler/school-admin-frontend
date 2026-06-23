/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AuthGuard from '../components/AuthGuard'
import { Spin } from '@arco-design/web-react'

const LoginPage = lazy(() => import('../pages/Login'))
const RegisterPage = lazy(() => import('../pages/Register'))
const CollegePage = lazy(() => import('../pages/College'))
const ClassRoomPage = lazy(() => import('../pages/ClassRoom'))
const StudentPage = lazy(() => import('../pages/Student'))
const TeacherPage = lazy(() => import('../pages/Teacher'))
const CoursePage = lazy(() => import('../pages/Course'))
const ScorePage = lazy(() => import('../pages/Score'))

const loading = <Spin size={60} style={{ textAlign: 'center', margin: '300px auto', height: '100%', width: '100%' }} tip="加载中..." />

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={loading}>
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/college" replace /> },
      { path: 'college', element: withSuspense(CollegePage) },
      { path: 'classroom', element: withSuspense(ClassRoomPage) },
      { path: 'student', element: withSuspense(StudentPage) },
      { path: 'teacher', element: withSuspense(TeacherPage) },
      { path: 'course', element: withSuspense(CoursePage) },
      { path: 'score', element: withSuspense(ScorePage) },
    ],
  },
])

export default router
