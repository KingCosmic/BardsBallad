import {VersionedResource} from "@storage/schemas/versionedResource";
import api from "@lib/api";

/**
 * Pushes updates for a list of versioned resources to the specified API endpoint.
 *
 * This function sends a POST request to the '/versions/push' endpoint with the provided
 * array of versioned resources. It returns the response data received from the API.
 *
 * @param {VersionedResource[]} items - An array of versioned resources to be pushed.
 * @returns {Promise<any>} A promise that resolves to the response data from the API.
 */
export const pushUpdatesForVersions = async (items: VersionedResource[]): Promise<any> => {
    return await api.post('/versions/push', items).then((response) => response.data)
}
