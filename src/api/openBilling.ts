import api from "../lib/api";

/**
 * Asynchronously initiates the process to open the billing portal.
 *
 * Makes an API call to retrieve the billing portal session data
 * from the server. The data includes the necessary information
 * to redirect the user to the Stripe customer portal for managing
 * their billing details.
 *
 * @returns {Promise<Object>} A promise that resolves with the response data
 *                            containing the billing portal session information.
 */
export const openBilling = async () => {
    return await api.get('/stripe/create-portal-session').then((response) => response.data)
}