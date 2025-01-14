import { model, Schema } from 'mongoose'
import { TAdmin, TUserName } from './admin.interface'

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First Name is required'],
        maxLength: [20, 'First Name can not be more than 20 character'],
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
        maxLength: [20, 'Last Name can not be more than 20 character'],
    },
})

const adminSchema = new Schema<TAdmin>(
    {
        id: { type: String, required: [true, 'ID is required'], unique: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            unique: true,
        },
        designation: { type: String, required: [true, 'Designation is required'] },
        name: {
            type: userNameSchema,
            required: [true, 'Student Name is required'],
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female', 'other'],
                message: '{VALUE} is not a valid gender.',
            },
            required: true,
        },
        religion: {
            type: String,
            enum: {
                values: ['muslim', 'hindu', 'buddhist', 'christian', 'others'],
                message: '{VALUE} is not a valid religions.',
            },
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of Birth is required'],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact Number is required'],
        },
        emergencyContactNumber: {
            type: String,
            required: [true, 'Emergency Contact Number is required'],
        },
        bloodGroup: {
            type: String,
            enum: {
                values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                message: '{VALUE} is not a valid blood group.',
            },
        },
        presentAddress: {
            type: String,
            required: [true, 'Present Address is required'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'Permanent Address is required'],
        },
        profileImgUrl: { type: String },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
)

// virtual
adminSchema.virtual('fullName').get(function () {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

// query middleware function
adminSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})
adminSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})

export const Admin = model<TAdmin>('Admin', adminSchema)
