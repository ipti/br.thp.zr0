import Cookies from 'js-cookie';


export const idTw = (idTw: string) => {
    const exp90 = new Date()
    exp90.setMinutes(exp90.getMinutes() + 90)
  return Cookies.set('id_tw', idTw, {expires: exp90})

}

export const getIdTw = () => {
  return Cookies.get('id_tw');
}

export const logout = () => {
  const allCookies = Cookies.get()
  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName)
  })
}