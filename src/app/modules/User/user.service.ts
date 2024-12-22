import config from '../../config'
import { TStudent } from '../Student/student.interface'
import { Student } from '../Student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {}

    // If the password not provided then use the default password
    userData.password = password || (config.default_password as string)

    // set student role
    userData.role = 'student'

    // manually generate ID
    userData.id = '2024101111'

    // create a userData
    const newUser = await User.create(userData)

    // create a student
    if (Object.keys(newUser).length) {
        studentData.id = newUser.id
        studentData.user = newUser._id

        const newStudent = await Student.create(studentData)
        return newStudent
    }
}

export const UserService = { createStudentIntoDB }
