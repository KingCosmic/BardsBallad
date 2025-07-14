import {getDeviceIdentifier} from "@utils/getDeviceName";
import {AuthStorage} from "@lib/storage";
import {saveToken} from "@state/auth";
import {updateDatabaseWithUserInfo} from "@storage/updateDatabaseWithUserInfo";
import api from "@lib/api";
import { addToast } from '@state/toasts';

/**
 * Logs in a user asynchronously by sending their credentials and device details to the authentication API.
 *
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {Promise<void>} A promise resolving when the login process is completed.
 *
 * @throws {Error} If the API request fails or the response data is incomplete.
 *
 * This function performs the following steps:
 * - Sends a POST request to the `/auth/login` endpoint with the provided credentials, device name, and device ID.
 * - Extracts the `accessToken`, `apiKey`, and `deviceId` from the response.
 * - Verifies that the required fields (`accessToken`, `apiKey`, `deviceId`) are present in the response.
 * - Saves the access token and updates necessary authentication-related properties stored locally.
 * - Updates the database with user information and associated device ID.
 */
export const login = async (username: string, password: string): Promise<{ success: boolean, error?: string }> => {
  const response = await api.post('/auth/login', {
    username,
    password,
    deviceName: await getDeviceIdentifier(),
    deviceId: await AuthStorage.get('deviceId')
  })

  if (response.status === 400) {
    if (typeof response.data === 'string') return { success: false, error: 'Required parameters are missing' }

    // TODO: return better error from response.data
    if (response.data.existing) return { success: false, error: 'Username and/or email alaready taken' }

    // TODO: return better error from response.data
    return { success: false, error: 'Input validation failed' }
  } else if (response.status === 500) {
    return { success: false, error: 'Failed to create user' }
  }

  const { accessToken, apiKey, deviceId } = response.data

  if (!(accessToken && apiKey && deviceId)) {
    // Register Response Failed Validation
    addToast('please report this code: #RRFV', 'error')

    return { success: false, error: 'please report this code: #RRFV' }
  }

  const user = await saveToken(accessToken)

  AuthStorage.set('apiKey', apiKey)
  AuthStorage.set('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)

  return { success: true }
}
