import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'
import auth from '../../middleware/auth'

const router = express.Router()

router.get('/', auth(), AdminControllers.getAllAdmins)
router.get('/:id', AdminControllers.getSingleAdmin)
router.delete('/:id', AdminControllers.deleteAdmin)
router.patch('/:id', validateRequest(adminValidations.updateAdminValidationSchema), AdminControllers.updateAdmin)

export const AdminRoutes = router
