import React, { useEffect, useRef } from 'react'

import { createGesture } from '@ionic/react'

type PressableProps = {
  onLongPress(): void
}

const Pressable: React.FC<React.PropsWithChildren<PressableProps>> = ({ children, onLongPress = () => {} }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  let longPressActive = false

  function longPress() {
    setTimeout(() => {
      if (longPressActive) {
        onLongPress()
      }
    }, 500)
  }

  useEffect(() => {
    if (ref.current) {
      const gesture = createGesture({
        el: ref.current,
        threshold: 0,
        onStart: () => {
          longPressActive = true
          longPress()
        },
        onEnd: () => {
          longPressActive = false
        },
        gestureName: 'long-press',
      });

      gesture.enable();
    }
  }, [])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}

export default Pressable