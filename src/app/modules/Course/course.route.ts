import express from 'express'
import { CourseControllers } from './course.controller'
import validateRequest from '../../middleware/validateRequest'
import { courseValidations } from './course.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.post(
    '/create-course',
    auth(USER_ROLE.admin),
    validateRequest(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
)
router.get('/', auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), CourseControllers.getAllCourses)
router.get('/:courseId', auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student), CourseControllers.getSingleCourse)
router.patch(
    '/:courseId',
    auth(USER_ROLE.admin),
    validateRequest(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
)
router.delete('/:courseId', auth(USER_ROLE.admin), CourseControllers.deleteCourse)
router.put(
    '/:courseId/assign-faculties',
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
)
router.delete(
    '/:courseId/remove-faculties',
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse,
)

export const CourseRoutes = router
