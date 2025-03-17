import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { StudentControllers } from './student.controller'
import { studentValidations } from './student.validation'
import validateRequest from '../../middleware/validateRequest'

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
    validateRequest(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
)
router.delete('/:studentId', auth(USER_ROLE.superAdmin, USER_ROLE.admin), StudentControllers.deleteStudent)

export const StudentRoutes = router
