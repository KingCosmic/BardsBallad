
export const loadEruda = () => {
  let script = document.createElement('script')

  script.id = 'eruda-script'
  script.src = 'https://cdn.jsdelivr.net/npm/eruda'

  document.body.append(script)

  script.onload = () => {
    // @ts-ignore eruda is provided via the script load.
    eruda.init()
  }
}

export const removeEruda = () => {
  const script = document.getElementById('eruda-script')

  if (!script) return

  // @ts-ignore eruda is provided via the script we're removing.
  eruda.destroy()
  script.remove()
}