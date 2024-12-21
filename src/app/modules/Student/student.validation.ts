import { z } from 'zod'

const userNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]+$/),
    middleName: z.string().max(20).optional(),
    lastName: z
        .string()
        .max(20)
        .min(1)
        .regex(/^[A-Z][a-z]+$/),
})

const guardianValidationSchema = z.object({
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

const localGuardianValidationSchema = z.object({
    name: z.string().max(50).min(1),
    occupation: z.string().max(50).min(1),
    contactNumber: z
        .string()
        .max(15)
        .min(10)
        .regex(/^[0-9]+$/),
    address: z.string().max(100).min(1),
})

const studentValidationSchema = z.object({
    id: z.string().max(50).min(1),
    name: userNameValidationSchema,
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
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImgUrl: z.string().url().optional(),
    isActive: z.enum(['active', 'inactive']),
    isDeleted: z.boolean(),
})

export default studentValidationSchema
