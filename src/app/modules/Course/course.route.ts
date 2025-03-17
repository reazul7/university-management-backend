import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../User/user.constant'
import { CourseControllers } from './course.controller'
import { courseValidations } from './course.validation'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.post(
    '/create-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getAllCourses,
)
router.get(
    '/:courseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getSingleCourse,
)
router.patch(
    '/:courseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
)
router.delete('/:courseId', auth(USER_ROLE.superAdmin, USER_ROLE.admin), CourseControllers.deleteCourse)

// assign course
router.put(
    '/:courseId/assign-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
)
router.get(
    '/:courseId/get-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.student),
    CourseControllers.getFacultiesWithCourse,
)
router.delete(
    '/:courseId/remove-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse,
)

export const CourseRoutes = router
