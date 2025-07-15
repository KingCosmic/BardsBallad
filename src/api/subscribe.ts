import api from "@lib/api";

/**
 * Creates a checkout session by making an asynchronous request to the Stripe API.
 *
 * This function performs a GET request to the endpoint '/stripe/create-checkout-session'
 * and retrieves the URL of the created checkout session. The returned object contains
 * the URL string that can be used for redirecting the user to the Stripe checkout page.
 *
 * @async
 * @function subscribe
 * @returns {Promise<{ url: string }>} A Promise that resolves to an object containing the checkout session URL.
 */
export const subscribe = async (): Promise<{ url: string }> => {
    return await api.get('/stripe/create-checkout-session').then((response) => response.data)
}
