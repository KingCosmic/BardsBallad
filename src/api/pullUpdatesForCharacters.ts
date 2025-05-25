import type {Character} from "@storage/schemas/character";
import api from "@lib/api";

/**
 * Asynchronously pulls updates for characters starting from a given checkpoint.
 * If the checkpoint is null, it starts from the beginning.
 *
 * @param {Object|null} checkpointOrNull - The checkpoint to start pulling updates from. If null, starts from the beginning.
 * @param {number} checkpointOrNull.updated_at - The timestamp indicating the last update.
 * @param {string} checkpointOrNull.id - The ID of the last processed character.
 * @param {number} batchSize - The maximum number of updates to fetch in a single batch.
 * @returns {Promise<Object>} A promise resolving to an object containing:
 * - `documents` (Character[]): An array of updated character records.
 * - `checkpoint` (Object): The new checkpoint containing the ID and updated timestamp of the last character processed.
 */
export const pullUpdatesForCharacters = async (checkpointOrNull: {
    updated_at: number,
    id: string
} | null, batchSize: number): Promise<{
    documents: Character[];
    checkpoint: { id: number, updated_at: string };
}> => {
    const updated_at = checkpointOrNull?.updated_at || 0
    const id = checkpointOrNull?.id || ''

    return await api.get<{ documents: any, checkpoint: any }>('/characters/pull', {
        params: {
            updated_at,
            id,
            batchSize
        }
    }).then((response) => response.data)
}
