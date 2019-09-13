import React, { Component } from 'react';
import styled from 'styled-components';

import merge from 'lodash.merge';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Text from '../../atoms/Text';
import Select from '../../atoms/Select';

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1vw;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const TextArea = styled.textarea`
  color: ${props => props.theme.text};
  width: 100%;
  height: 80px;
  max-height: 200px;
  font-size: 1vw;
  font-weight: 100;

  margin: 0;

  border-style: none;
  outline: none;
  resize: none;
  cursor: pointer;

  background-color: transparent;
`

export class Property extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value
    }, () => {
      this.props.callback(value)
    })
  }

  render() {
    const { title, placeholder, type, options, multi = false, full = false } = this.props;
    const { value } = this.state;

    return (
      <Container margin='5px 0' width={full ? '100%' : '50%'}>
        <Text size='0.8rem' weight='200' color='gold'>{title}</Text>

        {
          (type && type === 'select') ?
            <Select value={value} options={options} multi={multi} onChange={this.onChange} /> :
            <Input type={type ? type : 'text'} placeholder={placeholder} value={value} onChange={({ target: { value } }) => this.onChange(value)} />
        }
      </Container>
    )
  }
}

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Custom Feat',
      desc: '',
      uses: 0
    }

    this.editFeat = this.editFeat.bind(this)
  }

  componentWillMount() {
    this.setState({
      ...merge({}, this.state, this.props.featInfo)
    })
  }

  editFeat(path, data) {
    this.setState({ [path]: data })
  }

  render() {
    const { goBack, addFeat, title = 'New Feat' } = this.props;
    const { name, desc, uses } = this.state;

    return (
      <Container height='100%' width='100%'>
        <Container height='30px' margin='0 0 10px 0' justifyContent='space-around' direction='row'>
          <Text size='0.9rem' onClick={goBack}>Back</Text>

          <Title align='center'>{title}</Title>

          <Text size='0.9rem' onClick={() => addFeat(this.state)}>Confirm</Text>
        </Container>
        <Container flowY='auto' height='calc(100% - 40px)'>
          <Container>
            <Container direction='row'>
              <Property title='Name' placeholder='Greatsword' value={name} callback={(value) => this.editFeat('name', value)} />
              <Property title='uses' value={uses} type='number' callback={(value) => this.editFeat('uses', Number(value))} />
            </Container>

            <Title margin='10px 0 0'>Description</Title>
            <TextArea placeholder='Item description goes here' value={desc} onChange={(event) => this.editFeat('desc', event.target.value)} />
          </Container>
        </Container>
      </Container>
    )
  }
}

export default EditItem;