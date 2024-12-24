import { Router } from 'express'
import { StudentRoutes } from '../modules/Student/student.route'
import { UserRoutes } from '../modules/User/user.route'
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route'
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route'

const router = Router()

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/academic-semesters',
        route: AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: AcademicFacultyRoutes,
    },
]

moduleRoutes.map(route => router.use(route.path, route.route))

export default router
