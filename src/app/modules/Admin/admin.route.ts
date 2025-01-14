import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AdminController } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

router.get('/', AdminController.getAllAdmins)
router.get('/:id', AdminController.getSingleAdmin)
router.delete('/:id', AdminController.deleteAdmin)
router.patch('/:id', validateRequest(adminValidations.updateAdminValidationSchema), AdminController.updateAdmin)

export const AdminRoutes = router
