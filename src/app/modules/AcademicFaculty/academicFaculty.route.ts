import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AcademicFacultyValidation } from './academicFaculty.validation'
import { AcademicFacultyController } from './academicFaculty.controller'

const router = express.Router()

router.get('/', AcademicFacultyController.getAllAcademicFaculties)
router.get('/:academicFacultyId', AcademicFacultyController.getSingleAcademicFaculty)
router.post(
    '/create-academic-faculty',
    validateRequest(AcademicFacultyValidation.academicFacultyValidation),
    AcademicFacultyController.createAcademicFaculty,
)
router.patch(
    '/:academicFacultyId',
    validateRequest(AcademicFacultyValidation.academicFacultyValidation),
    AcademicFacultyController.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
