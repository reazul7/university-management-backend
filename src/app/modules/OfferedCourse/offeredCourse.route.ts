import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middleware/validateRequest'
import { OfferedCourseControllers } from './offeredCourse.controller'
import { OfferedCourseValidations } from './offeredCourse.validation'

const router = express.Router()

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse,
)
router.get('/my-offered-courses', auth(USER_ROLE.student), OfferedCourseControllers.getMyOfferedCourses)
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
router.patch(
    '/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse,
)
router.delete(
    '/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseControllers.deleteOfferedCourse,
)

export const OfferedCourseRoutes = router
