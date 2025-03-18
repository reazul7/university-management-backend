import { z } from 'zod'

const createAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Academic Department name is required',
        }),
        academicFaculty: z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Academic Faculty ID is required',
        }),
    }),
})

const updateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Academic Department must be string',
                required_error: 'Academic Department name is required',
            })
            .optional(),
        academicFaculty: z
            .string({
                invalid_type_error: 'Academic Faculty must be string',
                required_error: 'Academic Faculty ID is required',
            })
            .optional(),
    }),
})

export const AcademicDepartmentValidations = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
}
