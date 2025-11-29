import api from '@lib/api';
import { Item } from '@storage/index';
import { VersionedResource } from '@storage/schemas/versionedResource';

/**
 * Asynchronously publishes an item to the marketplace by sending the provided data to the API.
 *
 * This function makes a POST request to the '/marketplace' endpoint of the API with the specified
 * data. If the request is successful (status code 200), the function returns true. If there's
 * an error or the status code is not 200, the function returns false.
 */
export const publishVersion = async (id: string, data: {
  item_id: string;
  version: VersionedResource;
  changelog: string;
}): Promise<{ error?: string }> => {
  try {
    const response = await api.post(`/marketplace/${id}/versions`, data)

    if (response.status === 200) return {}

    return { error: response.data }
  } catch (err) {
    return { error: 'Error occurred during publishing new version' }
  }
}
