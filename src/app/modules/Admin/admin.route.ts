import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'
import validateRequest from '../../middleware/validateRequest'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getAllAdmins)
router.get('/all-list', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getAllAdminsList)
router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), AdminControllers.getSingleAdmin)
router.delete('/:id', auth(USER_ROLE.superAdmin), AdminControllers.deleteAdmin)
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        next()
    },
    validateRequest(adminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
)

export const AdminRoutes = router
