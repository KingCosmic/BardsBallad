import {UserSubscription} from "@storage/schemas/userSubscription";
import api from "@lib/api";

/**
 * Fetches updates for user subscriptions based on the provided checkpoint and batch size.
 * This function interacts with an API to retrieve updated subscription documents and a new checkpoint.
 *
 * @param {Object|null} checkpointOrNull - The latest checkpoint to start fetching updates from.
 *                                         If null, fetching starts from the beginning.
 * @param {number} checkpointOrNull.updated_at - The last timestamp at which updates were fetched.
 * @param {string} checkpointOrNull.id - The identifier associated with the last fetched update.
 * @param {number} batchSize - The maximum number of subscription updates to retrieve in a single call.
 * @returns {Promise<{documents: UserSubscription[], checkpoint: {id: number, updated_at: string}}>} A promise that resolves to an object containing:
 *          - `documents`: An array of user subscription updates.
 *          - `checkpoint`: An object with the new checkpoint data, including `id` and `updated_at` fields.
 */
export const pullUpdatesForSubscriptions = async (checkpointOrNull: {
    updated_at: number,
    id: string
} | null, batchSize: number): Promise<{
    documents: UserSubscription[];
    checkpoint: { id: number, updated_at: string };
}> => {
    const updated_at = checkpointOrNull?.updated_at || 0
    const id = checkpointOrNull?.id || ''

    return await api.get<{ documents: any, checkpoint: any }>('/subscriptions/pull', {
        params: {
            updated_at,
            id,
            batchSize
        }
    }).then((response) => response.data)
}
