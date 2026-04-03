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
        programCode: z.string({
            invalid_type_error: 'Program Code must be string',
            required_error: 'Program Code is required',
        }),
        academicDepartment: z.string({
            invalid_type_error: 'Academic Department must be string',
            required_error: 'Academic Department ID is required',
        }),
        durationInMonths: z.coerce
            .number({
                required_error: 'Duration is required',
                invalid_type_error: 'Duration must be a number',
            })
            .min(12, { message: 'Minimum duration is 12 months' })
            .max(72, { message: 'Maximum duration is 72 months' }),
        totalSemesters: z.coerce
            .number({
                required_error: 'Total Semester is required',
                invalid_type_error: 'Total Semester must be a number',
            })
            .min(3, { message: 'Minimum Semester is 3' })
            .max(18, { message: 'Maximum Semester is 18' }),
        totalCredits: z.coerce
            .number({
                required_error: 'Total credits is required',
                invalid_type_error: 'Total credits must be a number',
            })
            .min(1, { message: 'Minimum credits is 1' })
            .max(200, { message: 'Maximum credits is 200' }),
        status: z.enum(['active', 'inactive'], {
            invalid_type_error: 'Status must be valid',
            required_error: 'Status must be required',
        }),
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
        programCode: z
            .string({
                invalid_type_error: 'Program Code must be string',
                required_error: 'Program Code is required',
            })
            .optional(),
        academicDepartment: z
            .string({
                invalid_type_error: 'Academic Department must be string',
                required_error: 'Academic Department ID is required',
            })
            .optional(),
        durationInMonths: z.coerce
            .number({
                required_error: 'Duration is required',
                invalid_type_error: 'Duration must be a number',
            })
            .min(12, { message: 'Minimum duration is 12 months' })
            .max(72, { message: 'Maximum duration is 72 months' })
            .optional(),
        totalSemesters: z.coerce
            .number({
                required_error: 'Total Semester is required',
                invalid_type_error: 'Total Semester must be a number',
            })
            .min(3, { message: 'Minimum Semester is 3' })
            .max(18, { message: 'Maximum Semester is 18' })
            .optional(),
        totalCredits: z.coerce
            .number({
                required_error: 'Total credits is required',
                invalid_type_error: 'Total credits must be a number',
            })
            .min(1, { message: 'Minimum credits is 1' })
            .max(200, { message: 'Maximum credits is 200' })
            .optional(),
        status: z
            .enum(['active', 'inactive'], {
                invalid_type_error: 'Status must be valid',
                required_error: 'Status must be required',
            })
            .optional(),
    }),
})

export const AcademicProgramValidations = {
    createAcademicProgramValidationSchema,
    updateAcademicProgramValidationSchema,
}
