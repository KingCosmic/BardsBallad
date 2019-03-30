import styled, { css } from 'styled-components';

import Container from './Container';

const GridItem = styled(Container)`
  ${props => props.column && css` grid-column: ${props => props.column} `}
  ${props => props.row && css` grid-row: ${props => props.row} `}

  ${props => props.gridArea && css` grid-area: ${props => props.gridArea}; `}
  ${props => props.cursor && css` cursor: ${props => props.cursor}; `}
`

export default GridItem;