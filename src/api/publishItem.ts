import api from "@lib/api";

/**
 * Asynchronously publishes an item to the marketplace by sending the provided data to the API.
 *
 * This function makes a POST request to the '/marketplace' endpoint of the API with the specified
 * data. If the request is successful (status code 200), the function returns true. If there's
 * an error or the status code is not 200, the function returns false.
 *
 * @param {any} data - The data object containing the details of the item to be published.
 * @returns {Promise<boolean>} A promise that resolves to true if the item is published successfully, or false if the operation fails.
 */
export const publishItem = async (data: any): Promise<boolean> => {
    try {
        const response = await api.post('/marketplace', data)
        return response.status === 200;
    } catch (err) {
        return false;
    }
}
