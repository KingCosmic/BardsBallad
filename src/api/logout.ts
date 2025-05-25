import {AuthStorage, SyncStorage} from "@lib/storage";
import {authState} from "@state/auth";
import {db} from "@/storage";

/**
 * Handles the user logout process.
 *
 * This function clears authentication-related storage, updates the
 * authentication state to reflect that the user is logged out, and empties
 * all tables in the database. It uses asynchronous operations to clear
 * database tables efficiently.
 *
 * Updates:
 * - Clears data stored in `AuthStorage`.
 * - Clears data stored in `SyncStorage`.
 * - Resets the authentication state to indicate the user is logged out,
 *   removing any user-specific details and synced characters.
 * - Clears all database tables asynchronously.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when all tasks are completed, including
 * database table clearing.
 */
export const logout = async (): Promise<void> => {
    AuthStorage.clear()
    SyncStorage.clear()

    authState.set({isLoggedIn: false, user: null, synced_characters: []})

    await Promise.all(
        db.tables.map(table => table.clear())
    );
}
