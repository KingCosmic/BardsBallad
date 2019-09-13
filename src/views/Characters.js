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

const CreateCharacter = styled(Text)`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  bottom: 30px;
  right: 20px;
  font-size: 3em;
  padding: 0 18px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, .1);
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
      <Container display='inline-block' width='calc(100% - 40px)' height='calc(100% - 40px)' padding='20px'>
        {

          (characters.length === 0 && loaded === true) ? <EmptyState createCharacter={createCharacter} /> :

            characters.map(character => {
              const { name, job, exp } = character

              return <Character key={character._id} name={name} job={job} exp={exp} character={character} id={character._id} history={this.props.history} />
            })
        }

        <CreateCharacter onClick={createCharacter}>&#43;</CreateCharacter>
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