import { UserToken } from "./actions"

const initialState = {
  userToken: ''
}

export function userTokenReducer (state = initialState, action: UserToken) {
  return { userToken: action.payload }
}