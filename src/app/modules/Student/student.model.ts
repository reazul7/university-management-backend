import { model, Schema } from 'mongoose'
import { TGuardian, TLocalGuardian, TStudent, StudentMethods, StudentModel, TUserName } from './student.interface'

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

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        trim: true,
        required: [true, 'Father Name is required'],
    },
    fatherOccupation: {
        type: String,
        trim: true,
        required: [true, 'Father Occupation is required'],
    },
    fatherContactNumber: {
        type: String,
        trim: true,
        required: [true, 'Father Contact Number is required'],
    },
    motherName: {
        type: String,
        trim: true,
        required: [true, 'Mother name is required'],
    },
    motherOccupation: {
        type: String,
        trim: true,
        required: [true, 'Mother Occupation is required'],
    },
    motherContactNumber: {
        type: String,
        trim: true,
        required: [true, 'Mother Contact Number is required'],
    },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Local Guardian Name is required'],
    },
    occupation: {
        type: String,
        trim: true,
        required: [true, 'Local Guardian Occupation is required'],
    },
    contactNumber: {
        type: String,
        trim: true,
        required: [true, 'Local Guardian Contact Number is required'],
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'Local Guardian Address is required'],
    },
})

const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>(
    {
        id: { type: String, required: [true, 'ID is required'], unique: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            unique: true,
        },
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
        emergencyNumber: {
            type: String,
            required: [true, 'Emergency Number is required'],
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
        guardian: {
            type: guardianSchema,
            required: [true, 'Guardian is required'],
        },
        localGuardian: {
            type: localGuardianSchema,
            required: [true, 'Local Guardian is required'],
        },
        profileImgUrl: { type: String },
        admissionSemester: { type: Schema.ObjectId, ref: 'AcademicSemester' },
        academicDepartment: { type: Schema.ObjectId, ref: 'AcademicDepartment' },
        academicFaculty: { type: Schema.ObjectId, ref: 'AcademicFaculty' },
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
studentSchema.virtual('fullName').get(function () {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

// creating a custom instance method
studentSchema.methods.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id })
    return existingUser
}

// query middleware function
studentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})
studentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } })
    next()
})

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
