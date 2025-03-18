import { z } from 'zod'

const createUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/),
    middleName: z.string().max(20).optional(),
    lastName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/),
})
const createAdminValidationSchema = z.object({
    body: z.object({
        admin: z.object({
            designation: z.string(),
            name: createUserNameValidationSchema,
            gender: z.enum(['male', 'female', 'other']),
            religion: z.enum(['muslim', 'hindu', 'buddhist', 'christian', 'others']),
            dateOfBirth: z.string(),
            email: z.string().email(),
            contactNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/),
            emergencyContactNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            presentAddress: z.string().max(200).min(1),
            permanentAddress: z.string().max(200).min(1),
            // profileImgUrl: z.string().url().optional(),
        }),
    }),
})

const updateUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/)
        .optional(),
    middleName: z.string().max(20).optional(),
    lastName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/)
        .optional(),
})

const updateAdminValidationSchema = z.object({
    body: z.object({
        admin: z.object({
            designation: z.string().optional(),
            name: updateUserNameValidationSchema.optional(),
            gender: z.enum(['male', 'female', 'other']).optional(),
            religion: z.enum(['muslim', 'hindu', 'buddhist', 'christian', 'others']).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/)
                .optional(),
            emergencyContactNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/)
                .optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: z.string().max(200).min(1).optional(),
            permanentAddress: z.string().max(200).min(1).optional(),
            // profileImgUrl: z.string().url().optional(),
        }),
    }),
})

export const adminValidations = { createAdminValidationSchema, updateAdminValidationSchema }
