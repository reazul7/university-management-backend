import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { AuthValidations } from './auth.validation'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.post('/login', validateRequest(AuthValidations.loginValidationSchema), AuthControllers.loginUser)
router.post(
    '/change-password',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
)
router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
)
router.post(
    '/forget-password',
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
)
router.post(
    '/reset-password',
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
)

export const AuthRoutes = router
