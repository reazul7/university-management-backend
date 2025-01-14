import express from 'express'
import { UserControllers } from './user.controller'
import { studentValidations } from '../Student/student.validation'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from '../Faculty/faculty.validation'

const router = express.Router()

router.post(
    '/create-student',
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
)

router.post(
    '/create-faculty',
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
)

export const UserRoutes = router
