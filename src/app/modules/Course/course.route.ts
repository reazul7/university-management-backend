import express from 'express'
import { CourseControllers } from './course.controller'
import validateRequest from '../../middleware/validateRequest'
import { courseValidations } from './course.validation'
import auth from '../../middleware/auth'

const router = express.Router()

router.post(
    '/create-course',
    validateRequest(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
)
router.get('/', auth('admin', 'faculty', 'student'), CourseControllers.getAllCourses)
router.get('/:courseId', CourseControllers.getSingleCourse)
router.patch(
    '/:courseId',
    auth('admin'),
    validateRequest(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
)
router.delete('/:courseId', auth('admin'), CourseControllers.deleteCourse)
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
