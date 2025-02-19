import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidations } from './auth.validation'
import { AuthControllers } from './auth.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.post('/login', validateRequest(AuthValidations.loginValidationSchema), AuthControllers.loginUser)
router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
)

export const AuthRoutes = router
