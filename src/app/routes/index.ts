import { Router } from 'express'
import { StudentRoutes } from '../modules/Student/student.route'
import { UserRoutes } from '../modules/User/user.route'
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route'
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route'
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicDepartment.route'
import { FacultyRoutes } from '../modules/Faculty/faculty.route'
import { AdminRoutes } from '../modules/Admin/admin.route'
import { CourseRoutes } from '../modules/Course/course.route'

const router = Router()

const moduleRoutes = [
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
    },
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
    {
        path: '/academic-departments',
        route: AcademicDepartmentRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
]

moduleRoutes.map(route => router.use(route.path, route.route))

export default router
