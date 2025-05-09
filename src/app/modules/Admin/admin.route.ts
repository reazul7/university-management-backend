import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getAllAdmins)
router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getSingleAdmin)
router.delete('/:id', auth(USER_ROLE.superAdmin), AdminControllers.deleteAdmin)
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin),
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
)

export const AdminRoutes = router
