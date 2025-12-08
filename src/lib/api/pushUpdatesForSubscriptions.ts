import { Subscription } from '@/db/subscription/schema'
import api from '.'


/**
 * Sends updates for user subscriptions by making an asynchronous API POST request.
 *
 * @async
 * @function
 * @param {UserSubscription[]} items - An array of user subscription objects to be updated.
 * @returns {Promise<any>} A promise that resolves to the response data from the API.
 */
export const pushUpdatesForSubscriptions = async (items: Subscription[]): Promise<any> => {
    return await api.post('/subscriptions/push', items).then((response) => response.data)
}
