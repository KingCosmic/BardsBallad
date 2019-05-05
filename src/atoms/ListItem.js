import styled, { css } from 'styled-components';

const ListItem = styled.li`
  ${props => props.width && css` width: ${props => props.width}; `}
  ${props => props.height && css` height: ${props => props.height}; `}
  ${props => props.maxHeight && css` max-height: ${props => props.maxHeight}; `}
  ${props => props.maxWidth && css` max-width: ${props => props.maxWidth}; `}
  ${props => props.minHeight && css` min-height: ${props => props.minHeight}; `}

  ${props => props.flowWrap && css`
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  `}

  display: ${props => props.noFlex ? 'block' : 'flex'};
  ${props => props.direction && css` flex-direction: ${props => props.direction}; `}
  ${props => props.justifyContent && css` justify-content: ${props => props.justifyContent}; `}
  ${props => props.alignItems && css` align-items: ${props => props.alignItems}; `}
  ${props => props.alignSelf && css` align-self: ${props => props.alignSelf}; `}

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  ${props => props.hover && css`
    &:hover {
      background-color: ${props => props.theme[props.hover]};
    }
  `}

  ${props => props.cursor && css` cursor: pointer; `}

  ${props => props.bg && css`
    background-color: ${(props) => props.theme.dark};
    outline: 1px solid ${(props) => props.theme.almostblack};
  `}
`

export default ListItem;