
export default (obj: object) => {
  for (let _key in obj) return false
  return true
}