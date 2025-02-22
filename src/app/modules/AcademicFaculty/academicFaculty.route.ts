import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AcademicFacultyValidations } from './academicFaculty.validation'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import auth from '../../middleware/auth'

const router = express.Router()

router.get('/', auth(), AcademicFacultyControllers.getAllAcademicFaculties)
router.get('/:academicFacultyId', AcademicFacultyControllers.getSingleAcademicFaculty)
router.post(
    '/create-academic-faculty',
    validateRequest(AcademicFacultyValidations.academicFacultyValidation),
    AcademicFacultyControllers.createAcademicFaculty,
)
router.patch(
    '/:academicFacultyId',
    validateRequest(AcademicFacultyValidations.academicFacultyValidation),
    AcademicFacultyControllers.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
