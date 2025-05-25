import api from "@lib/api";

/**
 * Fetches subscription data for a given subscription ID.
 *
 * This asynchronous function makes an API call to retrieve details
 * about a subscription using the provided ID. If the API call succeeds,
 * the function returns the response data. If an error occurs during
 * the API request, the function returns null.
 *
 * @param {string} id - The unique identifier of the subscription.
 * @returns {Promise<any | null>} A promise resolving to the subscription data
 * or null if an error occurs during the API request.
 */
export const getSubscriptionData = async (id: string): Promise<any | null> => {
    try {
        const resp = await api.get(`/marketplace/subscribe/${id}`)

        return resp.data
    } catch (err) {
        return null;
    }
}
