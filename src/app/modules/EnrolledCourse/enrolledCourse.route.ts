import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middleware/validateRequest'
import { EnrolledCourseControllers } from './enrolledCourse.controller'
import { EnrolledCourseValidations } from './enrolledCourse.validation'

const router = express.Router()

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validateRequest(EnrolledCourseValidations.createEnrolledCourseValidationSchema),
    EnrolledCourseControllers.createEnrolledCourse,
)
router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty), EnrolledCourseControllers.getAllEnrolledCourses)
router.get('/my-enrolled-courses', auth(USER_ROLE.student), EnrolledCourseControllers.getMyEnrolledCourses)
router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    validateRequest(EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
)

export const EnrolledCourseRoutes = router
