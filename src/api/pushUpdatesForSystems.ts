import {System} from "@storage/schemas/system";
import api from "@lib/api";

/**
 * Sends a batch of system update items to the server for processing.
 *
 * This asynchronous function sends a POST request to the `/systems/push` endpoint
 * with the provided array of system objects. The response data from the server
 * is then returned upon successful completion.
 *
 * @param {System[]} items - An array of system objects to be pushed to the server.
 * @returns {Promise<any>} A promise resolving to the response data from the API.
 */
export const pushUpdatesForSystems = async (items: System[]): Promise<any> => {
    return await api.post('/systems/push', items).then((response) => response.data)
}
