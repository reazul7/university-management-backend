import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { StudentControllers } from './student.controller'
import { studentValidations } from './student.validation'
import validateRequest from '../../middleware/validateRequest'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.getAllStudents)
router.get(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    StudentControllers.getSingleStudent,
)
router.patch(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        next()
    },
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
)
router.delete('/:studentId', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.deleteStudent)

export const StudentRoutes = router
