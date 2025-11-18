import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AddData, useLocalData } from '@designer/renderer/Context'

import { ContainerProps } from './Editor'
import styles from './styles'
import globalStyles from '@designer/styles'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useScriptRunner } from '@components/ScriptRunnerContext'

export default (props: PropsWithChildren<ContainerProps>) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const state = useMemo(() => ({
    ...props.state,
    ...localData,
  }), [localData, props.state])

  const [items, setItems] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    async function rc() {
      if (!props.script!.isCorrect || !props.isList || !isReady) return setItems([])

      runScript<any[]>(props.script!.compiled, state, props.updateState!).then(output => setItems(output.result ?? []))
    }

    rc()
  }, [state, props.script, props.isList, props.updateState])

  useEffect(() => {
    async function rc() {
      if (!props.dynamicVisibility || !isReady) return setIsVisible(props.isVisible!)

      if (!props.visibilityScript!.isCorrect) return setIsVisible(props.isVisible!)

      const output = await runScript<boolean>(props.visibilityScript!.compiled, state, props.updateState!)

      setIsVisible(output.result ?? props.isVisible!)
    }

    rc()
  }, [state, props.isVisible, props.visibilityScript, props.updateState])

  const onClick = useCallback(() => {
    if (!props.isInteractive || !props.onPress!.isCorrect || !isReady) return
 
    runScript(props.onPress!.compiled, state, props.updateState!)
  }, [state, props.isInteractive, props.onPress, props.updateState])

  const backgroundClass = useMemo(() => styles[props.background!] ? styles[props.background!]?.background : '', [props.background])
  const borderClass = useMemo(() => styles[props.border!] ? styles[props.border!]?.border : '', [props.border])
  const hoverClass = useMemo(() => props.isInteractive ? styles[props.hover!]?.hover : '', [props.isInteractive])

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 4,
  })

  return (
    <div
      ref={parentRef}
      // @ts-ignore
      style={{
        display: isVisible ? props.display : 'none',
        // @ts-ignore
        position: props.isList ? 'relative' : props.position!,
        top: props.top,
        right: props.right,
        bottom: props.bottom,
        left: props.left,

        // @ts-ignore
        flexDirection: props.flexDirection,
        alignItems: props.alignItems,
        justifyContent: props.justifyContent,

        rows: props.rows,
        columns: props.columns,

        gap: globalStyles.spacing[props.gap!],

        marginTop: globalStyles.spacing[props.marginTop!],
        marginRight: globalStyles.spacing[props.marginRight!],
        marginBottom: globalStyles.spacing[props.marginBottom!],
        marginLeft: globalStyles.spacing[props.marginLeft!],

        ...(props.isList ? {} : ({
          paddingTop: globalStyles.spacing[props.paddingTop!],
          paddingRight: globalStyles.spacing[props.paddingRight!],
          paddingBottom: globalStyles.spacing[props.paddingBottom!],
          paddingLeft: globalStyles.spacing[props.paddingLeft!],
        })),

        // TODO: update this to allow for row lists.
        // TODO: 8 needs to be update to be the gap size in pxs.
        height: props.isList ? `${rowVirtualizer.getTotalSize() + items.length * 8}px` : globalStyles.size[props.height!],
        width: props.isList ? '' : globalStyles.size[props.width!],
        maxHeight: globalStyles.size[props.maxHeight!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minHeight: globalStyles.size[props.minHeight!],
        minWidth: globalStyles.size[props.minWidth!],
      }}
      className={`${backgroundClass} ${borderClass} ${hoverClass} rounded-lg`}
      onClick={onClick}
    >
      {
        props.isList ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,

            paddingTop: globalStyles.spacing[props.paddingTop!],
            paddingRight: globalStyles.spacing[props.paddingRight!],
            paddingBottom: globalStyles.spacing[props.paddingBottom!],
            paddingLeft: globalStyles.spacing[props.paddingLeft!],
            width: '100%',
            transform: `translateY(${items[0]?.start ?? 8}px)`, // TODO: 8 needs to be converted to the containers margin top / padding top.
            display: props.display,
            // @ts-ignore
            flexDirection: props.flexDirection,
            gap: globalStyles.spacing[props.gap!], 
          }}>
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = items[virtualItem.index]

              return (
                <div key={virtualItem.key} data-index={virtualItem.index} ref={rowVirtualizer.measureElement}>
                  <AddData localData={{ [props.dataName!]: item }}>
                    {/* @ts-ignore */}
                    {props.children}
                  </AddData>
                </div>
              )
            })}
          </div>
        ) : props.children
      }
    </div>
  )
}
