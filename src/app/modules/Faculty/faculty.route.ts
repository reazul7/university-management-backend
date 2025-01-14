import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'
import { FacultyController } from './faculty.controller'

const router = express.Router()

router.get('/', FacultyController.getAllFaculties)
router.get('/:id', FacultyController.getSingleFaculty)
router.delete('/:id', FacultyController.deleteFaculty)
router.patch('/:id', validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyController.updateFaculty)

export const FacultyRoutes = router
