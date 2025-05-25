import {saveToken} from "@state/auth";
import api from "@lib/api";

/**
 * Synchronizes Stripe data by making an API call to the Stripe sync endpoint.
 * This function retrieves a new access token from the response and saves it
 * using the saveToken function, if available.
 *
 * @function syncStripeData
 * @async
 * @returns {Promise<void>} A promise that resolves when the process completes.
 */
export const syncStripeData = async (): Promise<void> => {
    const response = await api.get('/stripe/sync-stripe-data')

    const {newAccessToken} = response.data

    if (!newAccessToken) return

    saveToken(newAccessToken)
}
