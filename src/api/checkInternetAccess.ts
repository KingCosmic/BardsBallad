import api from "@lib/api";

// Technically this doesn't check internet access, but rather if the server is reachable
// The client should be considered offline if the server isn't reachable.
/**
 * Asynchronously checks for internet connectivity by sending a ping request
 * to a predefined API endpoint.
 *
 * @function
 * @async
 * @returns {Promise<boolean>} A promise that resolves to `true` if the internet
 * access is available and the status code of the received response is 200.
 * Resolves to `false` if the request fails or any error occurs during the process.
 */
export const checkInternetAccess = async (): Promise<boolean> => {
    try {
        const response = await api.get('/ping');
        return response.status === 200;
    } catch (err) {
        return false;
    }
}
