import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { facultyValidations } from './faculty.validation'
import { FacultyControllers } from './faculty.controller'

const router = express.Router()

router.get('/', FacultyControllers.getAllFaculties)
router.get('/:id', FacultyControllers.getSingleFaculty)
router.delete('/:id', FacultyControllers.deleteFaculty)
router.patch(
    '/:id',
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty,
)

export const FacultyRoutes = router
