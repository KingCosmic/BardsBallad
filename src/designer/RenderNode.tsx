

// TODO: REWORK THIS SO IT WORKS LMAO


// import { useNode, useEditor } from '@craftjs/core'
// import { ROOT_NODE } from '@craftjs/utils'
// import React, { useEffect, useRef, useCallback } from 'react'
// import ReactDOM from 'react-dom'
// import styled from 'styled-components'

// import { ArrowUp, ArrowsOutCardinal, TrashSimple } from '@phosphor-icons/react'

// const IndicatorDiv = styled.div`
//   position: absolute;
//   display: flex;
//   height: 30px;
//   margin-top: -29px;
//   font-size: 12px;
//   line-height: 12px;
// `;

// const Btn = styled.a`
//   padding: 0 0px;
//   opacity: 0.9;
//   display: flex;
//   align-items: center;
//   > div {
//     position: relative;
//     top: -50%;
//     left: -50%;
//   }
// `;

// export const RenderNode = ({ render }:any) => {
//   const { id } = useNode();
//   const { actions, query, isActive } = useEditor((_, query) => ({
//     isActive: query.getEvent('selected').contains(id),
//   }));

//   const {
//     isHover,
//     dom,
//     name,
//     moveable,
//     deletable,
//     connectors: { drag },
//     parent,
//   } = useNode((node) => ({
//     isHover: node.events.hovered,
//     dom: node.dom,
//     name: node.data.custom.displayName || node.data.displayName,
//     moveable: query.node(node.id).isDraggable(),
//     deletable: query.node(node.id).isDeletable(),
//     parent: node.data.parent || undefined,
//     props: node.data.props,
//   }));

//   const currentRef = useRef<HTMLDivElement>();

//   useEffect(() => {
//     if (dom) {
//       if (isActive || isHover) dom.classList.add('component-selected');
//       else dom.classList.remove('component-selected');
//     }
//   }, [dom, isActive, isHover]);

//   const getPos = useCallback((dom: HTMLElement | null) => {
//     if (!dom) return { top: '0px', left: '0px', bottom: '0px' }
//     const { top, left, bottom } = dom
//       ? dom.getBoundingClientRect()
//       : { top: 0, left: 0, bottom: 0 };
//     return {
//       top: `${top > 0 ? top : bottom}px`,
//       left: `${left}px`,
//     };
//   }, [dom]);

//   const scroll = useCallback(() => {
//     const { current: currentDOM } = currentRef;

//     if (!currentDOM) return;
//     const { top, left } = getPos(dom);
//     currentDOM.style.top = top;
//     currentDOM.style.left = left;
//   }, [dom, getPos]);

//   useEffect(() => {
//     document
//       .querySelector('.page-container')?.addEventListener('scroll', scroll);

//     return () => {
//       document
//         .querySelector('.page-container')?.removeEventListener('scroll', scroll);
//     };
//   }, [scroll]);

//   return (
//     <>
//       {isHover || isActive
//         ? ReactDOM.createPortal(
//             <IndicatorDiv
//               // @ts-expect-error
//               ref={currentRef}
//               className="px-2 py-2 text-white bg-primary fixed flex items-center"
//               style={{
//                 left: getPos(dom).left,
//                 top: getPos(dom).top,
//                 zIndex: 9999,
//               }}
//             >
//               <h2 className="flex-1 mr-4">{name}</h2>
//               {moveable ? (
//                 // @ts-expect-error
//                 <Btn className="mr-2 cursor-move" ref={drag}>
//                   <ArrowsOutCardinal size={15} style={{ color: 'white' }} />
//                 </Btn>
//               ) : null}
//               {id !== ROOT_NODE && (
//                 <Btn
//                   className="mr-2 cursor-pointer"
//                   onClick={() => {
//                     actions.selectNode(parent);
//                   }}
//                 >
//                   <ArrowUp size={15} style={{ color: 'white' }} />
//                 </Btn>
//               )}
//               {deletable ? (
//                 <Btn
//                   className="cursor-pointer"
//                   onMouseDown={(e: React.MouseEvent) => {
//                     e.stopPropagation();
//                     actions.delete(id);
//                   }}
//                 >
//                   <TrashSimple size={15} style={{ color: 'white' }} />
//                 </Btn>
//               ) : null}
//             </IndicatorDiv>,
//             // @ts-expect-error
//             document.querySelector('.page-container')
//           )
//         : null}
//       {render}
//     </>
//   );
// };