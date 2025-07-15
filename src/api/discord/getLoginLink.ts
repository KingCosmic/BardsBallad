import api from "@lib/api";
import { addToast } from '@state/toasts';

export default async (): Promise<void> => {
  const response = await api.get('/discord/getLoginLink')

  const url = response.data

  if (!url) return addToast('No url in login link response?', 'error')

  window.open(url, '_self')
}
