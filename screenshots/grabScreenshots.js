import puppeteer from 'puppeteer'
import { androidDevices, iosDevices, chromeBook } from './devices.js'

const characterName = 'Eruga Satoru'

const takeScreenshots = async () => {
  // launch browser
  console.log('Launching browser...')
  const browser = await puppeteer.launch({ headless: 'shell'})

  // create new page
  console.log('Creating new page...')
  const page = await browser.newPage()

  // enable dark mode
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' }
  ])

  // navigate to the page
  console.log('Navigating to the page...')
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })

  // take homescreen screenshot
  console.log('Taking homescreen screenshot...')
  await takeDeviceScreenshots(page, 'homescreen')

  // navigate to the page
  console.log('Navigating to the characters page...')
  await page.goto('http://localhost:5173/characters', { waitUntil: 'networkidle2' })

  // take characters screenshot
  console.log('Taking characters screenshot...')
  await takeDeviceScreenshots(page, 'characters')

  // create new character
  console.log('Creating new character...')
  await page.locator('#floating-action-button').click()
  await page.locator('#character-name').fill(characterName)
  await page.locator('#create-character-button').click()

  // take new character screenshot
  console.log('Taking new character screenshot...')
  await takeDeviceScreenshots(page, 'new-character')

  // navigate to character page
  console.log('Navigating to character page...')
  await page.locator('.character-button').click()

  await page.waitForSelector('#loading-text', { visible: false })

  // change first tab to the combat tab
  console.log('Changing first tab to the combat tab...')
  await page.locator('.first-tab-selector').fill('Combat')

  // change second tab to the inventory tab
  console.log('Changing second tab to the inventory tab...')
  await page.locator('.second-tab-selector').fill('Inventory')

  // take character screenshot
  console.log('Taking character screenshot...')
  await takeDeviceScreenshots(page, 'character')

  // close browser
  console.log('Closing browser...')
  await browser.close()
}

const takeDeviceScreenshots = async (page, path) => {
  for (const device of androidDevices) {
    console.log('Emulating device...', device)
    await page.emulate(device)
    await takeScreenshot(page, `android/${path}-${device.name}`)
  }

  for (const device of iosDevices) {
    console.log('Emulating device...', device)
    await page.emulate(device)
    await takeScreenshot(page, `ios/${path}-${device.name}`)
  }
  
  console.log('Emulating device...', chromeBook)
  await page.emulate(chromeBook)
  await takeScreenshot(page, `${path}-chromebook`)
}

const takeScreenshot = async (page, path) => {
  await page.screenshot({ path: `screenshots/images/${path}.png`, fullPage: true })
}

takeScreenshots()