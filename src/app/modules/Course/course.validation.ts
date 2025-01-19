import { z } from 'zod'

const preRequisiteCourseValidationSchema = z.object({
    course: z.string(),
    isDelete: z.boolean().optional(),
})

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        isDelete: z.boolean().optional(),
        preRequisiteCourses: z.array(preRequisiteCourseValidationSchema).optional(),
    }),
})

const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        isDelete: z.boolean().optional(),
        preRequisiteCourses: z.array(preRequisiteCourseValidationSchema).optional(),
    }),
})

export const courseValidations = { createCourseValidationSchema, updateCourseValidationSchema }
