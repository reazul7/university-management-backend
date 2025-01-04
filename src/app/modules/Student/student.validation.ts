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
const createGuardianValidationSchema = z.object({
    fatherName: z.string().max(50).min(1),
    fatherOccupation: z.string().max(50).min(1),
    fatherContactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/),
    motherName: z.string().max(50).min(1),
    motherOccupation: z.string().max(50).min(1),
    motherContactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/),
})
const createLocalGuardianValidationSchema = z.object({
    name: z.string().max(50).min(1),
    occupation: z.string().max(50).min(1),
    contactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/),
    address: z.string().max(100).min(1),
})
const createStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
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
            emergencyNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            presentAddress: z.string().max(200).min(1),
            permanentAddress: z.string().max(200).min(1),
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            admissionSemester: z.string(),
            academicDepartment: z.string(),
            profileImgUrl: z.string().url().optional(),
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
const updateGuardianValidationSchema = z.object({
    fatherName: z.string().max(50).min(1).optional(),
    fatherOccupation: z.string().max(50).min(1).optional(),
    fatherContactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/)
        .optional(),
    motherName: z.string().max(50).min(1).optional(),
    motherOccupation: z.string().max(50).min(1).optional(),
    motherContactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/)
        .optional(),
})
const updateLocalGuardianValidationSchema = z.object({
    name: z.string().max(50).min(1).optional(),
    occupation: z.string().max(50).min(1).optional(),
    contactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/)
        .optional(),
    address: z.string().max(100).min(1).optional(),
})
const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
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
            emergencyNumber: z
                .string()
                .max(15)
                .min(10)
                .regex(/^[0-9]+$/)
                .optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: z.string().max(200).min(1).optional(),
            permanentAddress: z.string().max(200).min(1).optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            admissionSemester: z.string().optional(),
            academicDepartment: z.string().optional(),
            profileImgUrl: z.string().url().optional(),
        }),
    }),
})

export const studentValidations = { createStudentValidationSchema, updateStudentValidationSchema }
