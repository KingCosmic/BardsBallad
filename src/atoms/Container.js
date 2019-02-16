import styled, { css } from 'styled-components';

const Container = styled.div`
  ${props => props.width && css` width: ${props => props.width}; `}
  ${props => props.height && css` height: ${props => props.height}; `}
  ${props => props.maxHeight && css` max-height: ${props => props.maxHeight}; `}
  ${props => props.maxWidth && css` max-width: ${props => props.maxWidth}; `}

  ${props => props.float && css` float: left; `};

  ${props => props.flowX && css` overflow-x: ${props => props.flowX}; `}
  ${props => props.flowY && css`
    overflow-y: ${props => props.flowY}; 
    
    /* width */
    &::-webkit-scrollbar {
      width: ${props => props.barWidth || '10px'};
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background-color: rgba(32, 34, 37, .6);
      border-radius: 10px;
    }
 
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.almostblack};
      border-radius: 10px;
    }

  `}

  ${props => props.pos && css` position: ${props => props.pos}; `}
  ${props => props.top && css` top: ${props => props.top}; `}
  ${props => props.right && css` right: ${props => props.right}; `}
  ${props => props.left && css` left: ${props => props.left}; `}
  ${props => props.bottom && css` bottom: ${props => props.bottom}; `}
    
  display: ${props => props.noFlex ? 'block' : 'flex'};
  flex-direction: ${props => props.direction || 'column'};
  ${props => props.bases && css` flex-basis: ${props => props.bases}; `}
  ${props => props.justifyContent && css` justify-content: ${props => props.justifyContent}; `}
  ${props => props.alignItems && css` align-items: ${props => props.alignItems}; `}
  ${props => props.alignSelf && css` align-self: ${props => props.alignSelf}; `}

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  ${props => props.grow && css` flex-grow: ${props.grow}; `}

  ${props => props.bg && css`
    background-color: ${props => props.theme[props.bg] || props.theme.dark};
  `}

  ${props => props.ol && css`
    outline: 1px solid ${props => props.theme[props.ol] || props.theme.almostblack};
  `}

`

export default Container;