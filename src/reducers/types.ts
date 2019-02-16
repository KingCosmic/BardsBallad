
export interface Action {
  type: string,
  payload: {
    [index: string]: any
  }
}