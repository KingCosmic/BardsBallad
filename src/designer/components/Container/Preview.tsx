import { PropsWithChildren, useCallback, useMemo, useRef } from 'react'

import { AddData, useLocalData } from '@designer/renderer/Context'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import { ContainerProps } from './Editor'
import styles from './styles'
import globalStyles from '@designer/styles'

import { useVirtualizer } from '@tanstack/react-virtual'

export default (props: PropsWithChildren<ContainerProps>) => {
  const localData = useLocalData()

  const items: any[] = useMemo(() => {
    const processor = new BlueprintProcessor(props.blueprint!)

    const output = processor.processBlueprint(localData, props.state!, () => {}) ?? []

    return output
  }, [localData, props.state])

  const isVisible = useMemo(() => {
    if (!props.dynamicVisibility) return props.isVisible

    const processor = new BlueprintProcessor(props.visibilityBlueprint!)

    const isVisible = processor.processBlueprint(localData, props.state!, () => {}) || false

    return isVisible
  }, [localData, props.state])

  const onClick = useCallback(() => {
    if (!props.isInteractive) return

    const processor = new BlueprintProcessor(props.onPress!)

    processor.processBlueprint(localData, props.state!, props.updateState!)
  }, [props.onPress, localData, props.state, props.updateState])

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

        paddingTop: globalStyles.spacing[props.paddingTop!],
        paddingRight: globalStyles.spacing[props.paddingRight!],
        paddingBottom: globalStyles.spacing[props.paddingBottom!],
        paddingLeft: globalStyles.spacing[props.paddingLeft!],

        // TODO: update this to allow for row lists.
        // TODO: 8 needs to be update to be the gap size in pxs.
        height: props.isList ? `${rowVirtualizer.getTotalSize() + items.length * 8}px` : globalStyles.size[props.height!],
        width: props.isList ? '100%' : globalStyles.size[props.width!],
        maxHeight: globalStyles.size[props.maxHeight!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minHeight: globalStyles.size[props.minHeight!],
        minWidth: globalStyles.size[props.minWidth!],
      }}
      className={`${backgroundClass} ${borderClass} ${hoverClass}`}
      onClick={onClick}
    >
      {
        props.isList ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
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
