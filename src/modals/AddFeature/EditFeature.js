import React from 'react';
import styled from 'styled-components';

import Text from '../../components/Text';
import Select from '../../components/Select';
import TextArea from 'react-textarea-autosize';

const DesktopHeader = styled.div`
  display: none;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;

  @media only screen and (min-width: 768px) {
    display: flex;
  }
`

const Container = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  height: auto;
  padding: 0 15px;
  padding-top: 60px;
  transition: 0.5s;
  background-color: ${props => props.theme.dark};

  right: ${props => props.creatingFeat ? '0' : '-100%'};

  @media only screen and (min-width: 768px) {
    padding-top: 0;
  }
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
  font-size: 1.2em;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1em;
  font-weight: 200;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  width: ${props => props.full ? '100%' : '50%'};
`

const Property = (props) => {
  const { title, value, placeholder, type, options, multi = false, full = false, callback } = props;

  return (
    <PropertyContainer full={full}>
      <Text color='gold'>{title}</Text>

      {
        (type && type === 'select') ?
          <Select value={value} options={options} multi={multi} onChange={callback} /> :
          <Input type={type ? type : 'text'} placeholder={placeholder} value={value} onChange={({ target: { value } }) => callback(value)} />
      }
    </PropertyContainer>
  )
}

const EditItem = (props) => {
  const { editFeat, creatingFeat,
    showFeats, confirm,
    featData: {
      name, uses, desc
    }
  } = props;

  return (
    <Container creatingFeat={creatingFeat}>
      <DesktopHeader>
        <Text onClick={showFeats}>Back</Text>

        <Title>Editing {name}</Title>

        <Text onClick={confirm}>Confirm</Text>
      </DesktopHeader>

      <Row>
        <Property title='Name' placeholder='Greatsword' value={name} callback={(value) => editFeat('name', value)} />
        <Property title='uses' value={uses} type='number' callback={(value) => editFeat('uses', Number(value))} />
      </Row>

      <Text color='gold'>Description</Text>
      <TextArea placeholder='Item description goes here' value={desc} onChange={(event) => editFeat('desc', event.target.value)} />
    </Container>
  )
}

export default EditItem;