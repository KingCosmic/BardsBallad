import api from "@lib/api";

/**
 * Fetches items from the marketplace.
 *
 * This asynchronous function sends a GET request to the `/marketplace` endpoint using the `api` service.
 * If the request is successful, it returns the data from the server response as an array.
 * If the request fails, it returns an empty array.
 *
 * @async
 * @function
 * @returns {Promise<any[]>} A promise that resolves to an array of marketplace items.
 */
export const getMarketplaceItems = async (): Promise<any[]> => {
    try {
        const resp = await api.get(`/marketplace`)

        return resp.data
    } catch (err) {
        return [];
    }
}
