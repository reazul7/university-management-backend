import { z } from 'zod'

const createAcademicProgramValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'Academic Program must be string',
            required_error: 'Academic Program is required',
        }),
        degree: z.enum(['BSc', 'BA', 'BBA', 'LLB', 'MSc', 'MA', 'MBA', 'LLM'], {
            invalid_type_error: 'Degree must be valid',
            required_error: 'Degree must be required',
        }),
        level: z.enum(['undergraduate', 'postgraduate'], {
            invalid_type_error: 'Level must be valid',
            required_error: 'Level must be required',
        }),
        academicDepartment: z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Academic Department ID is required',
        }),
        durationInYears: z.coerce
            .number({
                required_error: 'Duration is required',
                invalid_type_error: 'Duration must be a number',
            })
            .min(1, { message: 'Minimum duration is 1 year' })
            .max(6, { message: 'Maximum duration is 6 years' }),

        totalCredits: z.coerce
            .number({
                required_error: 'Total credits is required',
                invalid_type_error: 'Total credits must be a number',
            })
            .min(1, { message: 'Minimum credits is 1' })
            .max(200, { message: 'Maximum credits is 200' }),
    }),
})

const updateAcademicProgramValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Academic Program must be string',
                required_error: 'Academic Program is required',
            })
            .optional(),
        degree: z
            .enum(['BSc', 'BA', 'BBA', 'LLB', 'MSc', 'MA', 'MBA', 'LLM'], {
                invalid_type_error: 'Degree must be valid',
                required_error: 'Degree must be required',
            })
            .optional(),
        level: z
            .enum(['undergraduate', 'postgraduate'], {
                invalid_type_error: 'Level must be valid',
                required_error: 'Level must be required',
            })
            .optional(),
        academicDepartment: z
            .string({
                invalid_type_error: 'Academic Department must be string',
                required_error: 'Academic Department ID is required',
            })
            .optional(),
        durationInYears: z.coerce
            .number({
                required_error: 'Duration is required',
                invalid_type_error: 'Duration must be a number',
            })
            .min(1, { message: 'Minimum duration is 1 year' })
            .max(6, { message: 'Maximum duration is 6 years' })
            .optional(),

        totalCredits: z.coerce
            .number({
                required_error: 'Total credits is required',
                invalid_type_error: 'Total credits must be a number',
            })
            .min(1, { message: 'Minimum credits is 1' })
            .max(200, { message: 'Maximum credits is 200' })
            .optional(),
    }),
})

export const AcademicProgramValidations = {
    createAcademicProgramValidationSchema,
    updateAcademicProgramValidationSchema,
}
