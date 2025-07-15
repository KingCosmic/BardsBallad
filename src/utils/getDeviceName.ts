function getWebDeviceName() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const lang = navigator.language;

  return `Web-${platform}-${lang}-${ua.slice(0, 15)}`; // trim UA to avoid huge string
}

export async function getDeviceIdentifier() {
  return getWebDeviceName()
}