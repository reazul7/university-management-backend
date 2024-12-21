import { TStudent } from './student.interface'
import { Student } from './student.model'

const createStudentIntoDB = async (studentData: TStudent) => {
    // const result = await Student.create(student)

    const student = new Student(studentData) //create a instance of Student
    if (await student.isUserExists(studentData.id)) {
        throw new Error('User already exists')
    }
    const result = await student.save()
    return result
}

const getAllStudentsFromDB = async () => {
    const result = await Student.find()
    return result
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
    return result
}

const deleteStudentFromDB = async (id: string) => {
    const result = await Student.updateOne({ id }, { isDeleted: true })
    return result
}

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
}
