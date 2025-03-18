import { Router } from 'express'
import { UserRoutes } from '../modules/User/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { AdminRoutes } from '../modules/Admin/admin.route'
import { CourseRoutes } from '../modules/Course/course.route'
import { StudentRoutes } from '../modules/Student/student.route'
import { FacultyRoutes } from '../modules/Faculty/faculty.route'
import { OfferedCourseRoutes } from '../modules/OfferedCourse/offeredCourse.route'
import { EnrolledCourseRoutes } from '../modules/EnrolledCourse/enrolledCourse.route'
import { AcademicFacultyRoutes } from '../modules/AcademicFaculty/academicFaculty.route'
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route'
import { AcademicDepartmentRoutes } from '../modules/AcademicDepartment/academicDepartment.route'
import { SemesterRegistrationRoutes } from '../modules/SemesterRegistration/semesterRegistration.route'

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
    {
        path: '/semester-registrations',
        route: SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/enrolled-courses',
        route: EnrolledCourseRoutes,
    },
]

moduleRoutes.map(route => router.use(route.path, route.route))

export default router
