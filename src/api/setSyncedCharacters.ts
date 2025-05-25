import {updateSyncedCharacters} from "@state/auth";
import api from "@lib/api";

/**
 * Asynchronously updates and synchronizes the list of character IDs with the server and local state.
 *
 * This function accepts an array of character IDs, updates the local state with the provided characters,
 * sends a request to the server to change the synced characters, and updates the local state again
 * once the server has processed the request.
 *
 * @param {string[]} characters - An array of character IDs to synchronize.
 * @returns {Promise<object>} A promise that resolves with the server response data after the synchronization is complete.
 */
export const setSyncedCharacters = async (characters: string[]): Promise<object> => {
    updateSyncedCharacters(characters)
    const response = await api.post('/characters/change-synced', {characterIds: characters})

    updateSyncedCharacters(characters)

    return response.data
}
