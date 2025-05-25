import {VersionedResource} from "@storage/schemas/versionedResource";
import api from "@lib/api";

/**
 * Pulls updates for versions from the server based on a checkpoint and batch size.
 *
 * @param {Object|null} checkpointOrNull - The checkpoint object or null.
 * @param {number} checkpointOrNull.updated_at - The timestamp of the last update.
 * @param {string} checkpointOrNull.id - The ID of the last checkpoint.
 * @param {number} batchSize - The size of the batch to retrieve.
 * @returns {Promise<Object>} A promise that resolves to an object containing the list of versioned resources
 * and the new checkpoint.
 * @property {VersionedResource[]} documents - The list of versioned resources retrieved.
 * @property {Object} checkpoint - The new checkpoint object.
 * @property {number} checkpoint.id - The ID of the checkpoint.
 * @property {string} checkpoint.updated_at - The timestamp of the new checkpoint.
 */
export const pullUpdatesForVersions = async (checkpointOrNull: {
    updated_at: number,
    id: string
} | null, batchSize: number): Promise<{
    documents: VersionedResource[];
    checkpoint: { id: number, updated_at: string };
}> => {
    const updated_at = checkpointOrNull?.updated_at || 0
    const id = checkpointOrNull?.id || ''

    return await api.get<{ documents: any, checkpoint: any }>('/versions/pull', {
        params: {
            updated_at,
            id,
            batchSize
        }
    }).then((response) => response.data)
}
