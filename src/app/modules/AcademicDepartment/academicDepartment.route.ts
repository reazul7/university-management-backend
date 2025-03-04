import express from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { USER_ROLE } from '../User/user.constant'
import { AcademicDepartmentControllers } from './academicDepartment.controller'
import { AcademicDepartmentValidations } from './academicDepartment.validation'

const router = express.Router()

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.createAcademicDepartment,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicDepartmentControllers.getAllAcademicDepartments,
)
router.get(
    '/:academicDepartmentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicDepartmentControllers.getSingleAcademicDepartment,
)
router.patch(
    '/:academicDepartmentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
