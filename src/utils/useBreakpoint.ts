import { useState, useEffect } from 'react'

const breakpoints: { [key:string]: any } = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
}

const useBreakpoint = (point: string, op: string) => {
  const [usebp, setUsebp] = useState(false)
  
  const resize = () => {
    const width = window.innerWidth

    const bp = breakpoints[point]

    if (!bp) return
  
    if (op === 'more') {
      if (width > bp) {
        setUsebp(true)
      } else {
        setUsebp(false)
      }
    } else if (op === 'more') {
      if (width < bp) {
        setUsebp(true)
      } else {
        setUsebp(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resize)

    resize()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return usebp
}

export default useBreakpoint