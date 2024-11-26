const getEndPoint = <T extends Record<string, string>>(baseURL: string, subEndpoint: T) => {
  for (const key in subEndpoint) {
    subEndpoint[key] = `${baseURL}${subEndpoint[key]}` as T[Extract<keyof T, string>]
  }

  return subEndpoint
}

const _authEndpoint = {
  BASE: '',
  LOGIN: '/login/',
  REFRESH: '/refresh/',
  REGISTER: '/register/',
  CHANGE_PASSWORD: '/change_password/',
}

const _userEndpoint = {
  BASE: '',
  GET_ME: '/get_me/',
  UPDATE_AVATAR: '/{id}/update-avatar/',
  DELETE_MULTIPLE: '/delete_multiple/',
}

const _studentEndpoint = {
  BASE: '/',
  CREATE: '/create/',
}

const _classEndpoint = {
  BASE: '',
  CREATE: '/create/',
}

const _subjectEndpoint = {
  BASE: '',
}

const _userClassEndpoint = {
  BASE: '',
}

const _classSubjectEndpoint = {
  BASE: '',
}

const _scheduleEndpoint = {
  BASE: '',
}

export const _userSubjectScore = {
  BASE: '',
  AVERAGE_SCORE: '/average_score/',
}

export const _notificationEndpoint = {
  BASE: '',
}

export const _settingEndpoint = {
  BASE: '',
}

export const _statisticEndpoint = {
  BASE: '/',
}

export const _documentsEndpoint = {
  BASE: '',
}

export const authEndpoint = getEndPoint('/auth', _authEndpoint)
export const userEndpoint = getEndPoint('/user', _userEndpoint)
export const studentEndpoint = getEndPoint('/student', _studentEndpoint)
export const classEndpoint = getEndPoint('/class', _classEndpoint)
export const subjectEndpoint = getEndPoint('/subject', _subjectEndpoint)
export const userClassEndpoint = getEndPoint('/user_class', _userClassEndpoint)
export const classSubjectEndpoint = getEndPoint('/class_subject', _classSubjectEndpoint)
export const scheduleEndpoint = getEndPoint('/schedule', _scheduleEndpoint)
export const userSubjectScore = getEndPoint('/user_subject_score', _userSubjectScore)
export const notificationEndpoint = getEndPoint('/notification', _notificationEndpoint)
export const settingEndpoint = getEndPoint('/setting', _settingEndpoint)
export const statisticEndpoint = getEndPoint('/statistic', _statisticEndpoint)
export const documentsEndpoint = getEndPoint('/document', _documentsEndpoint)
