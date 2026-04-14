import { useState, useEffect, useCallback } from 'react'
import * as automerge from '@automerge/automerge'

export function useAutomergeDoc<T>(initialBinary: Uint8Array<ArrayBufferLike>) {
  const [doc, setDoc] = useState<automerge.next.Doc<T> | null>(null)

  // Load binary on mount
  useEffect(() => {
    if (initialBinary) {
      const loaded = automerge.load<T>(initialBinary)
      setDoc(loaded)
    } else {
      setDoc(automerge.init())
    }
  }, [])

  // Change function — always produces a new doc reference
  const change = useCallback((changeFn: automerge.ChangeFn<T>) => {
    setDoc(current => {
      return automerge.change(current ?? automerge.init(), changeFn)
    })
  }, [])

  // Save back to binary whenever you need
  const save = useCallback(() => {
    if (doc) return automerge.save(doc)
  }, [doc])

  return { doc, change, save }
}