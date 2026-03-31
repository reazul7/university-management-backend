import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middleware/validateRequest'
import { AcademicProgramValidations } from './academicProgram.validation'
import { AcademicProgramControllers } from './academicProgram.controller'

const router = express.Router()

router.post(
    '/create-academic-program',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicProgramValidations.createAcademicProgramValidationSchema),
    AcademicProgramControllers.createAcademicProgram,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicProgramControllers.getAllAcademicPrograms,
)
router.get(
    '/all-list',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicProgramControllers.getAllAcademicProgramsList,
)
router.get(
    '/:academicProgramId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicProgramControllers.getSingleAcademicProgram,
)
router.patch(
    '/:academicProgramId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicProgramValidations.updateAcademicProgramValidationSchema),
    AcademicProgramControllers.updateAcademicProgram,
)
router.delete(
    '/:academicProgramId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AcademicProgramControllers.deleteAcademicProgram,
)

export const AcademicProgramRoutes = router
