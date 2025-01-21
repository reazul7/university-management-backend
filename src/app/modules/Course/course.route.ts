import express from 'express'
import { CourseControllers } from './course.controller'
import validateRequest from '../../middleware/validateRequest'
import { courseValidations } from './course.validation'

const router = express.Router()

router.post(
    '/create-course',
    validateRequest(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
)
router.get('/', CourseControllers.getAllCourses)
router.get('/:courseId', CourseControllers.getSingleCourse)
router.patch(
    '/:courseId',
    validateRequest(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
)
router.delete('/:courseId', CourseControllers.deleteCourse)
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
