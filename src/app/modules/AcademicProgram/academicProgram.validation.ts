import { z } from 'zod'

const createAcademicProgramValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Academic Program must be string',
            required_error: 'Academic Program name is required',
        }),
        degree: z.string({
            invalid_type_error: 'Academic degree must be string',
            required_error: 'Academic degree is required',
        }),
        academicDepartment: z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Academic Department ID is required',
        }),
        durationInYears: z.number(),
        totalCredits: z.number(),
    }),
})

const updateAcademicProgramValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Academic Program must be string',
                required_error: 'Academic Program name is required',
            })
            .optional(),
        degree: z
            .string({
                invalid_type_error: 'Academic degree must be string',
                required_error: 'Academic degree is required',
            })
            .optional(),
        academicDepartment: z
            .string({
                invalid_type_error: 'Academic Department must be string',
                required_error: 'Academic Department ID is required',
            })
            .optional(),
        durationInYears: z.number().optional(),
        totalCredits: z.number().optional(),
    }),
})

export const AcademicProgramValidations = {
    createAcademicProgramValidationSchema,
    updateAcademicProgramValidationSchema,
}
