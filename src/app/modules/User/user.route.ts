import express from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { UserControllers } from './user.controller'
import { studentValidations } from '../Student/student.validation'
import { facultyValidations } from '../Faculty/faculty.validation'
import { adminValidations } from '../Admin/admin.validation'
import { USER_ROLE } from './user.constant'
import { UserValidations } from './user.validation'

const router = express.Router()

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
)
router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
)
router.post(
    '/create-admin',
    auth(USER_ROLE.admin),
    validateRequest(adminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
)
router.get('/me', auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), UserControllers.getMe)
router.post(
    '/change-status/:id',
    auth(USER_ROLE.admin),
    validateRequest(UserValidations.changeStatusValidationSchema),
    UserControllers.changeStatus,
)

export const UserRoutes = router
