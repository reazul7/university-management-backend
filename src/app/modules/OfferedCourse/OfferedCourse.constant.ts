import { TDays } from './offeredCourse.interface'

export const Days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export type TSchedule = {
    days: TDays[]
    startTime: string
    endTime: string
}
