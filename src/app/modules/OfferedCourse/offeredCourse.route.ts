import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { OfferedCourseValidations } from './offeredCourse.validation'
import { OfferedCourseControllers } from './offeredCourse.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse,
)
router.patch(
    '/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseControllers.getAllOfferedCourses,
)
router.get(
    '/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    OfferedCourseControllers.getSingleOfferedCourse,
)
router.delete(
    '/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseControllers.deleteOfferedCourse,
)

export const OfferedCourseRoutes = router
