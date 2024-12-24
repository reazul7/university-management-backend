import {
    TAcademicSemesterCode,
    TAcademicSemesterName,
    TMonths,
} from './academicSemester.interface'

export const Months: TMonths[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
export const AcademicSemesterName: TAcademicSemesterName[] = [
    'Spring',
    'Summer',
    'Fall',
]
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03']

export const AcademicSemesterNameCodeMapper = {
    Spring: '01',
    Summer: '02',
    Fall: '03',
}
