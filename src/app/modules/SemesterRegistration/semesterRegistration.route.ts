import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middleware/validateRequest'
import { SemesterRegistrationValidations } from './semesterRegistration.validation'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'

const router = express.Router()

router.post(
    '/create-semester-registration',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema),
    SemesterRegistrationControllers.createSemesterRegistration,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    SemesterRegistrationControllers.getAllSemesterRegistrations,
)
router.get(
    '/:semesterRegistrationId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    SemesterRegistrationControllers.getSingleSemesterRegistration,
)
router.patch(
    '/:semesterRegistrationId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema),
    SemesterRegistrationControllers.updateSemesterRegistration,
)
router.delete(
    '/:semesterRegistrationId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    SemesterRegistrationControllers.deleteSemesterRegistration,
)

export const SemesterRegistrationRoutes = router
