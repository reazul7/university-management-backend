import express from 'express'
import { AcademicDepartmentControllers } from './academicDepartment.controller'
import validateRequest from '../../middleware/validateRequest'
import { AcademicDepartmentValidation } from './academicDepartment.validation'

const router = express.Router()

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)
router.post(
    '/create-academic-department',
    // validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.createAcademicDepartment,
)
router.get('/:academicDepartmentId', AcademicDepartmentControllers.getSingleAcademicDepartment)
router.patch(
    '/:academicDepartmentId',
    validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
