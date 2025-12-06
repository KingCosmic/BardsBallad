import { v4 as uuidv4 } from 'uuid'

export default () => {
  const device_id = localStorage.getItem('deviceId')
    
  return `${device_id}-${uuidv4()}`
}