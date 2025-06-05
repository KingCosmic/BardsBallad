import api from "@lib/api";

/**
 * Represents an async function that initializes a billing portal session via the Stripe API.
 *
 * @function openBilling
 * @returns {Promise<{ url: string }>} A promise that resolves to an object containing the URL of the billing portal session.
 */
export const openBilling = async (): Promise<{ url: string }> => {
    return await api.get('/stripe/create-portal-session').then((response) => response.data)
}
