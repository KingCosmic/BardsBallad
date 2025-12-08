function getWebDeviceName() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  return `${platform}-${ua.slice(0, 15)}`; // trim UA to avoid huge string
}

export function getDeviceIdentifier() {
  return getWebDeviceName()
}