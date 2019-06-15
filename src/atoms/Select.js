import React, { Component } from 'react';
import styled from 'styled-components';
import Text from './Text';

const DropdownContent = styled.div`
  display: ${props => props.open ? 'block' : 'none'};
  position: absolute;
  background-color: ${props => props.theme.middleblack};
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  p {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;

    &:hover {
      background-color: ${props => props.theme.grey};
    }
  }
`

const Dropdown = styled.div`
  cursor: pointer;
  min-width: 39px;
  justify-content: center;

  position: relative;
  display: inline-block;
`

const Value = styled(Text)`
  font-weight: 200;
`

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }

    this.openSelect = this.openSelect.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  openSelect() {
    this.setState({
      open: true
    })
  }

  onSelect(value) {
    this.setState({
      open: false
    }, () => {
      this.props.onChange(value);
    })
  }

  render() {
    const { value, options, onChange, multi = false } = this.props;
    const { open } = this.state;

    console.log(open)

    return (
      <Dropdown onClick={this.openSelect}>
        <Value>{options.find(opt => opt.value === value).label}</Value>
        <DropdownContent open={open} onClick={(e) => e.stopPropagation()}>
          {
            options.map(({ value, label }, i) => <Value key={i} onClick={() => this.onSelect(value)}>{label}</Value>)
          }
        </DropdownContent>
      </Dropdown>
    )
  }
}

export default Select;