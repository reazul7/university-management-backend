import { model, Schema } from 'mongoose'
import { Guardian, LocalGuardian, Student, UserName } from './student.interface'

const userNameSchema = new Schema<UserName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First Name is required'],
        maxLength: [20, 'First Name can not be more than 20 character'],
        validate: {
            validator: function (value) {
                const firstNameStr =
                    value.charAt(0).toUpperCase() + value.slice(1)
                return firstNameStr === value
            },
            message: 'First Name should start with capital letter',
        },
    },
    middleName: {
        type: String,
        trim: true,
        maxLength: [20, 'Middle Name can not be more than 20 character'],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
        maxLength: [20, 'Last Name can not be more than 20 character'],
    },
})

const guardianSchema = new Schema<Guardian>({
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

const localGuardianSchema = new Schema<LocalGuardian>({
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

const studentSchema = new Schema<Student>({
    id: { type: String, required: [true, 'ID will be unique'], unique: true },
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
    dateOfBirth: {
        type: String,
        required: [true, 'Date of Birth is required'],
    },
    email: { type: String, unique: true },
    contactNumber: { type: String, required: true },
    emergencyNumber: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: '{VALUE} is not a valid blood group.',
        },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
        type: guardianSchema,
        required: true,
    },
    localGuardian: {
        type: localGuardianSchema,
        required: true,
    },
    profileImgUrl: { type: String },
    isActive: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
        required: true,
    },
})

// 3. Create a Model.
export const StudentModel = model<Student>('Student', studentSchema)
