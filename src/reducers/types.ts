
export interface Actions {
  [index: string]: Function
}

export interface Action {
  type: string,
  payload: {
    [k: string]: any
  }
}