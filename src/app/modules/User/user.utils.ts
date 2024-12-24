import { TAcademicSemester } from '../AcademicSemester/academicSemester.interface'
import { User } from './user.model'

const findLastStudentId = async () => {
    const lastStudentId = await User.findOne({ role: 'student' }, { id: 1 })
        .sort({ createdAt: -1 })
        .lean()
    return lastStudentId?.id ? lastStudentId.id.substring(6) : undefined
}

export const generateStudentId = async (payload: TAcademicSemester) => {
    const currentId = (await findLastStudentId()) || (0).toString()
    let incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0')
    incrementId = `${payload.year}${payload.code}${incrementId}`
    return incrementId
}
