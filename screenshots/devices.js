
export const androidDevices = [
  {
    name: "Samsung Galaxy S21",
    userAgent: "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36",
    viewport: {
      width: 360,
      height: 800,
      deviceScaleFactor: 3.0,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    }
  },
  {
    name: 'Pixel 5',
    userAgent:
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
    viewport: {
      width: 393,
      height: 851,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    },
  },
  {
    name: 'Galaxy Tab S4 landscape',
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Safari/537.36',
    viewport: {
      width: 1138,
      height: 712,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      isLandscape: true,
    },
  }
]

export const iosDevices = [
  {
    name: 'iPhone 14',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    viewport: {
      width: 390,
      height: 663,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    },
  },
  {
    name: 'iPhone 14 Pro',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    viewport: {
      width: 393,
      height: 659,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    },
  },
]

export const chromeBook = {
  name: "Google Chromebook",
  userAgent: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
  viewport: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1.0,
    isMobile: false,
    hasTouch: false,
    isLandscape: true
  }
}