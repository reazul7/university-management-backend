import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middleware/validateRequest'
import { AcademicSemesterControllers } from './academicSemester.controller'
import { AcademicSemesterValidations } from './academicSemester.validation'

const router = express.Router()

router.post(
    '/create-academic-semester',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicSemesterValidations.createAcademicSemesterValidation),
    AcademicSemesterControllers.createAcademicSemester,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicSemesterControllers.getAllAcademicSemesters,
)
router.get(
    '/:academicSemesterId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicSemesterControllers.getSingleAcademicSemester,
)
router.patch(
    '/:academicSemesterId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidation),
    AcademicSemesterControllers.updateAcademicSemester,
)

export const AcademicSemesterRoutes = router
