import { Device } from '@capacitor/device'

function getWebDeviceName() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const lang = navigator.language;

  return `Web-${platform}-${lang}-${ua.slice(0, 15)}`; // trim UA to avoid huge string
}

async function getDeviceName() {
  const info = await Device.getInfo();
  const deviceName = `${info.manufacturer || 'Unknown'} ${info.model || 'Device'}`;
  return deviceName;
}

export async function getDeviceIdentifier() {
  // Check if running in a Capacitor environment
  // @ts-ignore
  if (window.Capacitor && window.Capacitor.isNativePlatform) {
    return await getDeviceName();
  } else {
    return getWebDeviceName();
  }
}