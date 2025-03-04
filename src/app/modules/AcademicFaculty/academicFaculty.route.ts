import express from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { USER_ROLE } from '../User/user.constant'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import { AcademicFacultyValidations } from './academicFaculty.validation'

const router = express.Router()

router.post(
    '/create-academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidations.academicFacultyValidation),
    AcademicFacultyControllers.createAcademicFaculty,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicFacultyControllers.getAllAcademicFaculties,
)
router.get(
    '/:academicFacultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicFacultyControllers.getSingleAcademicFaculty,
)
router.patch(
    '/:academicFacultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidations.academicFacultyValidation),
    AcademicFacultyControllers.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
