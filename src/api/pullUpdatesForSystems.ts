import {System} from "@storage/schemas/system";
import api from "@lib/api";

/**
 * Fetches updates for systems starting from a given checkpoint.
 *
 * This function retrieves a batch of system updates from the server based
 * on the specified checkpoint and batch size. If no checkpoint is provided,
 * updates will be fetched from the start.
 *
 * @param {Object|null} checkpointOrNull - The checkpoint indicating the starting point for updates.
 * @param {number} checkpointOrNull.updated_at - The timestamp of the last updated system.
 * @param {string} checkpointOrNull.id - The ID of the last processed system.
 * @param {number} batchSize - The maximum number of updates to fetch in a single batch.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `documents` (System[]): An array of updated systems.
 * - `checkpoint` (Object): The new checkpoint for the next batch of updates, containing:
 *   - `id` (number): The ID of the most recently processed system.
 *   - `updated_at` (string): The updated timestamp of the most recently processed system.
 */
export const pullUpdatesForSystems = async (checkpointOrNull: {
    updated_at: number,
    id: string
} | null, batchSize: number): Promise<{
    documents: System[];
    checkpoint: { id: number, updated_at: string };
}> => {
    const updated_at = checkpointOrNull?.updated_at || 0
    const id = checkpointOrNull?.id || ''

    return await api.get<{ documents: any, checkpoint: any }>('/systems/pull', {
        params: {
            updated_at,
            id,
            batchSize
        }
    }).then((response) => response.data)
}
