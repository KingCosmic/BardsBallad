import type {Character} from "@storage/schemas/character";
import api from "@lib/api";

/**
 * Asynchronously pushes updates for a list of characters to the server.
 *
 * This function takes an array of character objects and sends it to the server
 * via an HTTP POST request to update their details. It returns the response data
 * received from the server.
 *
 * @param {Character[]} items - An array of character objects to be updated.
 * @returns {Promise<any>} A promise that resolves to the data returned by the server.
 */
export const pushUpdatesForCharacters = async (items: Character[]): Promise<any> => {
    return await api.post('/characters/push', items).then((response) => response.data)
}
