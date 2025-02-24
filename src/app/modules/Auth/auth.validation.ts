import { z } from 'zod'

const loginValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'ID is required' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old Password is required' }),
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
})

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'Refresh Token is required' }),
    }),
})

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User ID is required' }),
    }),
})

const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User ID is required' }),
        newPassword: z
            .string({ required_error: 'User Password is required' })
            .min(8, { message: 'Password cannot be less than 8 character' })
            .max(20, { message: 'Password cannot be more than 20 character' }),
    }),
})

export const AuthValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
}
