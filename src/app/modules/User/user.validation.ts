import { z } from 'zod'

const userSchemaValidation = z.object({
    password: z
        .string({
            invalid_type_error: 'Password must be string',
        })
        .min(8, { message: 'Password cannot be less than 8 character' })
        .max(20, { message: 'Password cannot be more than 20 character' })
        .optional(),
})

export const UserValidations = { userSchemaValidation }
