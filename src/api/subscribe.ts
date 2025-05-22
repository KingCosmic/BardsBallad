import api from "../lib/api";

/**
 * Asynchronously initiates a subscription checkout session.
 * This function sends a GET request to the API endpoint '/stripe/create-checkout-session'
 * to create a Stripe checkout session and retrieves the session data from the API response.
 *
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to the data returned from the API response.
 *                            The data typically contains the details for the checkout session.
 */
export const subscribe = async () => {
    return await api.get('/stripe/create-checkout-session').then((response) => response.data)
}