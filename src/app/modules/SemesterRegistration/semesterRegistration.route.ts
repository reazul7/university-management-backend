import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { SemesterRegistrationValidations } from './semesterRegistration.validation'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'

const router = express.Router()

router.post(
    '/create-semester-registration',
    validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema),
    SemesterRegistrationControllers.createSemesterRegistration,
)
router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations)
router.get('/:semesterRegistrationId', SemesterRegistrationControllers.getSingleSemesterRegistration)
router.patch(
    '/:semesterRegistrationId',
    validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema),
    SemesterRegistrationControllers.updateSemesterRegistration,
)
router.delete('/:semesterRegistrationId', SemesterRegistrationControllers.deleteSemesterRegistration)

export const SemesterRegistrationRoutes = router
