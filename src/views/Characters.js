import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadAll, createCharacter } from '../reducers/characters';
import { startCharacterCreation, changeCharacterCreationStage } from '../reducers/ui';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

import CharacterCreation from '../components/CharacterCreation';
import Character from '../components/Character';

const AddCharacter = styled(Button)`
  position: absolute;
  bottom: 15px;
  right: 15px;
`
const Span = styled.span`
  text-decoration: underline;
  color: rgba(255, 255, 255, .6);
  cursor: pointer;
`

const EmptyState = ({ createCharacter }) =>
  <Container height='100%' justifyContent='center' alignItems='center'><Text size='2.2vw' width='50%'>You don't seem to have any characters, why don't you try <Span onClick={createCharacter}>Creating One</Span>?</Text></Container>

class Characters extends Component {

  componentWillMount() {

    if (!this.props.loaded) this.props.loadAll()

  }

  render() {

    const { characters, createCharacter, creatingCharacter, creationStage,
      changeCharacterCreationStage, loaded
    } = this.props;

    if (creatingCharacter) {
      return (
        <CharacterCreation stage={creationStage} changeStage={changeCharacterCreationStage} />
      )
    }

    return (
      <Container width='calc(100% - 40px)' height='calc(100% - 40px)' padding='20px'>
        {

          (characters.length === 0 && loaded === true) ? <EmptyState createCharacter={createCharacter} /> :

            characters.map(character => {
              const { name, job, exp } = character

              return <Character key={character._id} name={name} job={job} exp={exp} character={character} id={character._id} />
            })
        }

        <AddCharacter onClick={createCharacter} width='150px'>Add Character</AddCharacter>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters,
    loaded: state.characters.loaded,
    creatingCharacter: state.ui.creatingCharacter,
    creationStage: state.ui.creationStage
  }
}


export default withRouter(connect(mapStateToProps, { loadAll, createCharacter, startCharacterCreation, changeCharacterCreationStage })(Characters));