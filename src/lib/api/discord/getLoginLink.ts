import api from '..'


export default async (): Promise<void> => {
  const response = await api.get('/discord/getLoginLink')

  const url = response.data

  if (!url) return

  window.open(url, '_self')
}
