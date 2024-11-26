import { date, mixed, number, object, ref, string } from 'yup'

export const CREATE_STUDENT_SCHEMA = object({
  full_name: string().required(),
  email: string().email().required(),
  class_id: string().required(),
  date_of_birth: date().required().max(new Date()),
  avatar: mixed().required(),
  address: string().required(),
  phone_number: string()
    .required()
    .test({
      name: 'is_phone',
      test: (value) => {
        const PHONE_REGEX = /^[0-9]{10}$/

        return PHONE_REGEX.test(value)
      },
      message: 'Invalid phone number',
    }),
})

export const UPDATE_STTUDENT_SCHEMA = object({
  full_name: string().required(),
  date_of_birth: date().required().max(new Date()),
  address: string().required(),
  phone_number: string()
    .required()
    .test({
      name: 'is_phone',
      test: (value) => {
        const PHONE_REGEX = /^[0-9]{10}$/

        return PHONE_REGEX.test(value)
      },
      message: 'Invalid phone number',
    }),
})

export const CREATE_TEACHER_SCHEMA = object({
  fullname: string().required(),
  email: string().email().required(),
  date_of_birth: date().required().max(new Date()),
  avatar: mixed().required(),
  address: string().required(),
  gender: string().required(),
  phone_number: string()
    .required()
    .test({
      name: 'is_phone',
      test: (value) => {
        const PHONE_REGEX = /^[0-9]{10}$/

        return PHONE_REGEX.test(value)
      },
      message: 'Invalid phone number',
    }),
})

export const UPDATE_TEACHER_SCHEMA = object({
  fullname: string().required(),
  date_of_birth: date().required().max(new Date()),
  address: string().required(),
  gender: string().required(),
  phone_number: string()
    .required()
    .test({
      name: 'is_phone',
      test: (value) => {
        const PHONE_REGEX = /^[0-9]{10}$/

        return PHONE_REGEX.test(value)
      },
      message: 'Invalid phone number',
    }),
})

export const CREATE_CLASS_SCHEMA = object({
  key: string().required(),
  name: string().required(),
  year: string()
    .required()
    .test({
      name: 'is_valid_year',
      test(value) {
        const YEAR_REGEX = /^[0-9]{4}$/

        return YEAR_REGEX.test(value)
      },
      message: 'Invalid year',
    }),
  teacher: string(),
})

export const CREATE_SUBJECT_SCHEMA = object({
  name: string().required(),
  key: string().required(),
  grade: number().required(),
})

export const LOGIN_SCHEMA = object({
  email: string().email().required(),
  password: string().required(),
})

export const ADD_SUBJECT_SCHEMA = object({
  subject: string().required(),
  teacher_id: string().required(),
  year: string()
    .required()
    .length(4)
    .test({
      name: 'is_valid_year',
      test(value) {
        const YEAR_REGEX = /^[0-9]{4}$/

        return YEAR_REGEX.test(value)
      },
      message: 'Invalid year',
    }),
  semester: number().required(),
})

export const EDIT_SUBJECT_CLASS_SCHEMA = object({
  teacher_id: string().required(),
  year: string()
    .required()
    .length(4)
    .test({
      name: 'is_valid_year',
      test(value) {
        const YEAR_REGEX = /^[0-9]{4}$/

        return YEAR_REGEX.test(value)
      },
      message: 'Invalid year',
    }),
  semester: number().required(),
})

export const SEND_NOTIFICATION_SCHEMA = object({
  title: string().required(),
  description: string().required(),
})

export const UPDATE_SETTING_RATE_SCORE_SCHEMA = object({
  '15MIN': number().required().integer().max(100).positive(),
  LESSION: number().required().integer().max(100).positive(),
  MIDDLE: number().required().integer().max(100).positive(),
  FINAL: number().required().integer().max(100).positive(),
})

export const CREATE_DOCUMENT_SCHEMA = object({
  title: string().required(),
  description: string().required(),
  subject: string().required(),
  url: string().required(),
})

export const CHANGE_PASSWORD_SCHEMA = object({
  old_password: string().required().max(50).min(6),
  new_password: string().required().max(50).min(6),
  confirm_new_password: string()
    .required()
    .max(50)
    .oneOf([ref('new_password')]),
})
