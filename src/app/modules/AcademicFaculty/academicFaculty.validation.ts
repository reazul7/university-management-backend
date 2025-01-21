import { z } from 'zod'

const academicFacultyValidation = z.object({
    body: z.object({
        name: z.string(),
    }),
})

export const AcademicFacultyValidations = { academicFacultyValidation }
