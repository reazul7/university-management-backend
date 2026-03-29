import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { facultyValidations } from './faculty.validation'
import { FacultyControllers } from './faculty.controller'
import validateRequest from '../../middleware/validateRequest'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getAllFaculties)
router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getSingleFaculty)
router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), FacultyControllers.deleteFaculty)
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        next()
    },
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
)

export const FacultyRoutes = router
