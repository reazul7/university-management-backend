import express from 'express'
import { AcademicDepartmentControllers } from './academicDepartment.controller'
import validateRequest from '../../middleware/validateRequest'
import { AcademicDepartmentValidations } from './academicDepartment.validation'

const router = express.Router()

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)
router.post(
    '/create-academic-department',
    // validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.createAcademicDepartment,
)
router.get('/:academicDepartmentId', AcademicDepartmentControllers.getSingleAcademicDepartment)
router.patch(
    '/:academicDepartmentId',
    validateRequest(AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
