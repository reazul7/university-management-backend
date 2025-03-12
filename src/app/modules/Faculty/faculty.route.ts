import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'
import { FacultyControllers } from './faculty.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getAllFaculties)
router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getSingleFaculty)
router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), FacultyControllers.deleteFaculty)
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
)

export const FacultyRoutes = router
