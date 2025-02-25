import { z } from 'zod'
import { UserStatus } from './user.constant'

const userSchemaValidation = z.object({
    password: z
        .string({
            invalid_type_error: 'Password must be string',
        })
        .min(8, { message: 'Password cannot be less than 8 character' })
        .max(20, { message: 'Password cannot be more than 20 character' })
        .optional(),
})

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...UserStatus] as [string, ...string[]]),
    }),
})

export const UserValidations = { userSchemaValidation, changeStatusValidationSchema }
