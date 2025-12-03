import { v4 as uuidv4 } from 'uuid'

export default () => {
  const device_id = localStorage.getItem('device-id')
    
  return `${device_id}-${uuidv4()}`
}