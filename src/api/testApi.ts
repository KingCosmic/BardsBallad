import api from "@lib/api";

/**
 * Asynchronous function to test the API endpoint.
 *
 * Makes a GET request to the '/test' endpoint and retrieves data from the response.
 * If the request is successful, the function returns the response data.
 * In case of an error, it logs the error to the console and returns null.
 *
 * @function testApi
 * @async
 * @returns {Promise<any>} A promise that resolves to the response data if the request is successful, or null if an error occurs.
 */
export const testApi = async (): Promise<any> => {
    try {
        const response = await api.get('/test')
        return response.data
    } catch (err) {
        console.error('Error testing API:', err)
        return null
    }
}
