import express from 'express'
import { CourseController } from './course.controller'
import validateRequest from '../../middleware/validateRequest'
import { courseValidations } from './course.validation'

const router = express.Router()

router.post(
    '/create-course',
    validateRequest(courseValidations.createCourseValidationSchema),
    CourseController.createCourse,
)
router.get('/', CourseController.getAllCourses)
router.get('/:courseId', CourseController.getSingleCourse)
router.patch(
    '/:courseId',
    validateRequest(courseValidations.updateCourseValidationSchema),
    CourseController.updateCourse,
)
router.delete('/:courseId', CourseController.deleteCourse)

export const CourseRoutes = router
