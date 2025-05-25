import { v4 as uuidv4 } from 'uuid'
import { AuthStorage } from '@lib/storage'

export default async () => {
  const device_id = await AuthStorage.get('deviceId') || 'none'
    
  return `${device_id}-${uuidv4()}`
}
