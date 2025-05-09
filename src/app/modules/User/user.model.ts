import bcrypt from 'bcrypt'
import config from '../../config'
import { model, Schema } from 'mongoose'
import { UserStatus } from './user.constant'
import { TUser, UserModel } from './user.interface'

const userSchema = new Schema<TUser, UserModel>(
    {
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: 0 },
        needsPasswordChange: { type: Boolean, default: true },
        passwordChangeAt: { type: Date },
        role: {
            type: String,
            enum: ['superAdmin', 'admin', 'faculty', 'student'],
            required: true,
        },
        status: {
            type: String,
            enum: UserStatus,
            default: 'in-progress',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
    next()
})

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})

// check if user is exist
userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password')
}

// check if user password is Matched
userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000
    return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
