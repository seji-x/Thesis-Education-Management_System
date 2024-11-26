import Cookies from 'js-cookie'

export const getClientCookie = Cookies.get

export const setClientCookie = Cookies.set

export const removeClientCookie = Cookies.remove

export const cleanCLientCookie = () => {
  const cookies = Cookies.get()

  for (const key in cookies) {
    Cookies.remove(key)
  }
}
