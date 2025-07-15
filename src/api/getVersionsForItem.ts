import api from "@lib/api";

/**
 * Retrieves a list of versions for a given item based on its ID.
 *
 * This asynchronous function makes a GET request to an API to fetch the versions associated with a specific item.
 * If the API call is successful, it returns an array of versions. In case of an error during the request,
 * an empty array is returned as a fallback.
 *
 * @param {string} id - The unique identifier of the item for which versions are to be retrieved.
 * @returns {Promise<any[]>} A promise that resolves to an array of versions for the item.
 */
export const getVersionsForItem = async (id: string): Promise<any[]> => {
    try {
        const resp = await api.get(`/marketplace/${id}/versions`)

        return resp.data
    } catch (err) {
        return [];
    }
}
