import api from "@lib/api";

/**
 * Retrieves a marketplace item by its unique identifier.
 *
 * This function makes an asynchronous request to fetch data for a specific marketplace item using its ID.
 * If the request is successful, it returns the data of the item.
 * If an error occurs during the request (e.g., item not found or network error), it returns null.
 *
 * @param {string} id - The unique identifier of the marketplace item to retrieve.
 * @returns {Promise<any | null>} A promise that resolves to the marketplace item data if found, or null in case of an error.
 */
export const getMarketplaceItem = async (id: string): Promise<any | null> => {
    try {
        const resp = await api.get(`/marketplace/${id}`)
        return resp.data
    } catch (err) {
        return null;
    }
}
