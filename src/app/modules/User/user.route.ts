import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { UserControllers } from './user.controller'
import { studentValidations } from '../Student/student.validation'
import { facultyValidations } from '../Faculty/faculty.validation'
import { adminValidations } from '../Admin/admin.validation'
import { USER_ROLE } from './user.constant'
import { UserValidations } from './user.validation'
import { upload } from '../../utils/sendImageToCloudinary'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
)
router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
)
router.post(
    '/create-admin',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
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
