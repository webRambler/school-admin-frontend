import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AuthGuard from '../components/AuthGuard'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'
import CollegePage from '../pages/College'
import ClassRoomPage from '../pages/ClassRoom'
import StudentPage from '../pages/Student'
import TeacherPage from '../pages/Teacher'
import CoursePage from '../pages/Course'
import ScorePage from '../pages/Score'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
      { path: 'college', element: <CollegePage /> },
      { path: 'classroom', element: <ClassRoomPage /> },
      { path: 'student', element: <StudentPage /> },
      { path: 'teacher', element: <TeacherPage /> },
      { path: 'course', element: <CoursePage /> },
      { path: 'score', element: <ScorePage /> },
    ],
  },
])

export default router
