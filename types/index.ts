import { SVGProps } from 'react'

import { Role } from '@/helper/enums'
import { daysOfWeek, exams } from '@/config/constants'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export interface IUser {
  id: string
  username: string
  full_name: string
  role: Role
  email: string
  code: string
  avatar: string | null
  gender: 'MALE' | 'FEMALE'
  date_of_birth: string
  date_joined: string
  phone_number: string | null
  address: string | null
}

export interface IClass {
  id: string
  name: string
  key: string
  year: number
  student_count: number
  teacher: IUser | null
}

export interface ISubject {
  id: string
  name: string
  key: string
  grade: string
}

export type TDayOfWeek = (typeof daysOfWeek)[number]

export interface ISchedule {
  id: string
  day_of_week: TDayOfWeek
  period: number
  created_at: string
  updated_at: string
  class_subject: IClassSubject
}

export interface IClassSubject {
  id: string
  class_instance: IClass
  created_at: string
  updated_at: string
  status: TClassSubjectStatus
  subject: ISubject
  teacher_id?: IUser
  year: number | null
  semester?: 1 | 2
}

export type TExam = (typeof exams)[number]

export type TScore = Record<Partial<TExam>, number>

export interface IUserSubjectScore {
  id: string
  score: TScore
  average_score: number | null
  student_id: IUser
  subject: ISubject
  class_subject: IClassSubject
  status: 'OPEN' | 'CONFIRM'
}

export interface INotification {
  id: string
  detail: string | null
  status: boolean
  title: string
  created_at: string
  updated_at: string
  sender: IUser
}

export type TGender = 'MALE' | 'FEMALE'

export type TClassSubjectStatus = 'ACTIVE' | 'CLOSED'

export interface ISetting {
  SCORE_SCHEMA?: {
    '15MIN': number
    LESSION: number
    MIDDLE: number
    FINAL: number
  }
}

export interface IDocument {
  id: string
  subject: ISubject
  title: string
  description: string
  url: string
  created_at: string
  updated_at: string
}
