import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { OfferedCourseValidations } from './offeredCourse.validation'
import { OfferedCourseControllers } from './offeredCourse.controller'

const router = express.Router()

router.post(
    '/create-offered-course',
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse,
)
router.patch(
    '/:offeredCourseId',
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse,
)
router.get('/', OfferedCourseControllers.getAllOfferedCourses)
router.get('/:offeredCourseId', OfferedCourseControllers.getSingleOfferedCourse)
router.delete('/:offeredCourseId', OfferedCourseControllers.deleteOfferedCourse)

export const OfferedCourseRoutes = router
