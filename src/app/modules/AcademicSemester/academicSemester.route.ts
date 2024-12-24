import express from 'express'
import { AcademicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middleware/validateRequest'
import { AcademicSemesterValidation } from './academicSemester.validation'

const router = express.Router()

router.post(
    '/create-academic-semester',
    validateRequest(
        AcademicSemesterValidation.createAcademicSemesterValidation,
    ),
    AcademicSemesterControllers.createAcademicSemester,
)
router.get('/', AcademicSemesterControllers.getAllAcademicSemesters)
router.get(
    '/:academicSemesterId',
    AcademicSemesterControllers.getSingleAcademicSemester,
)
router.patch(
    '/:academicSemesterId',
    validateRequest(
        AcademicSemesterValidation.updateAcademicSemesterValidation,
    ),
    AcademicSemesterControllers.updateAcademicSemester,
)

export const AcademicSemesterRoutes = router
