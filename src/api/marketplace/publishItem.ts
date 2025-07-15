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
export const publishItem = async (data: {
  item: Item;
  version: VersionedResource;

  description: string;
  
  resource_type: string;

  is_public: boolean;
}): Promise<{ error?: string }> => {
  try {
    const response = await api.post('/marketplace', data)

    if (response.status === 200) return {}

    return { error: response.data }
  } catch (err) {
    return { error: 'Error occured during publish' }
  }
}
