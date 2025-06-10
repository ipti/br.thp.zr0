const TOKEN_KEY = "token-zr0";
const ID_TW = "id-tw"

export const idTw = (idTw: string) => {
  return localStorage.setItem(ID_TW, idTw)
}

export const getIdTw = () => {
  return localStorage.getItem(ID_TW);
}

export const isAuthenticated = () => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);


  // localStorage.clear();
};

