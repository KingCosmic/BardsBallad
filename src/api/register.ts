import { getDeviceIdentifier } from "@utils/getDeviceName";
import { saveToken } from "@state/auth";
import { AuthStorage } from "@lib/storage";
import { updateDatabaseWithUserInfo } from "@storage/updateDatabaseWithUserInfo";
import api from "@lib/api";
import { addToast } from '@state/toasts';

/**
 * Registers a new user by sending their credentials to the authentication API.
 * The function handles user registration by sending required data to the server,
 * saving authentication tokens, and updating the local storage and database
 * with the provided information.
 *
 * @param {string} username - The username provided by the user for registration.
 * @param {string} email - The email address provided by the user for registration.
 * @param {string} password - The password provided by the user for registration.
 * @returns {Promise<void>} A promise that resolves once the registration process is completed.
 */
export const register = async (username: string, email: string, password: string): Promise<void> => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
    deviceName: await getDeviceIdentifier()
  })

  const { accessToken, apiKey, deviceId } = response.data
  
  console.log(response.data)

  if (!(accessToken && apiKey && deviceId)) {
    // Register Response Failed Validation
    return addToast('please report this code: #RRFV', 'error')
  }

  const user = await saveToken(accessToken)

  AuthStorage.set('apiKey', apiKey)
  AuthStorage.set('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)
}
