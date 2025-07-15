import { setOptions } from 'react-scan'

export const startScanning = () => {
  setOptions({ enabled: true, showToolbar: true })
}

export const stopScanning = () => {
  setOptions({ enabled: false, showToolbar: false })
}