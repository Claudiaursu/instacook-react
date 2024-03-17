export type UserToken = {
  type: string,
  payload: string
}

export const setUserToken = (userToken: any) => (dispatch: (arg0: UserToken) => void) => {
  dispatch({
    type: 'userToken',
    payload: userToken
  })
}