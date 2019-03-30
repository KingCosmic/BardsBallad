import styled, { css } from 'styled-components';

const List = styled.ul`
  ${props => props.width && css` width: ${props => props.width}; `}
  ${props => props.height && css` height: ${props => props.height}; `}

  ${props => props.flowX && css` overflow-x: ${props => props.flowX}; `}
  ${props => props.flowY && css`
    overflow-y: 'auto'; 
    
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
      background: ${props => props.theme.red}; 
      border-radius: 10px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #b30000; 
    }
  `}

  list-style-type: none;

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  ${props => props.grow && css` flex-grow: ${props.grow}; `}

  ${props => props.bg && css`
    background-color: ${(props) => props.theme.dark};
    outline: 1px solid ${(props) => props.theme.almostblack};
  `}

`

export default List;