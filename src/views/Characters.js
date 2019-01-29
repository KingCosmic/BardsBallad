import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Container from '../atoms/Container';

import Character from '../components/Character';

const Characters = ({ characters }) => {
  return (
    <Container>
      {
        characters.map(({ name, job, lvl, id }) =>
          <Character key={id} name={name} job={job} lvl={lvl} id={id} />)
      }
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Characters));