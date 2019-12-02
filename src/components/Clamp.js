import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

export default class ClampLines extends PureComponent {
  constructor(props) {
    super(props);

    this.element = React.createRef();
    this.original = props.text;
    this.watch = true;
    this.lineHeight = 0;
    this.start = 0;
    this.middle = 0;
    this.end = 0;
    this.uuid = props.id;
    this.state = {
      expanded: true,
      noClamp: false,
      text: props.text.substring(0, 20),
    };

    this.action = this.action.bind(this);

    this.debounced = this.debounce(this.action, props.delay);
  }

  componentDidMount() {
    if (this.props.text) {
      this.lineHeight = this.element.current.clientHeight + 1;
      this.clampLines();

      if (this.watch) {
        window.addEventListener('resize', this.debounced);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounced);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.original = this.props.text;
      this.clampLines();
    }
  }

  debounce(func, wait, immediate) {
    let timeout;

    return () => {
      let context = this,
        args = arguments;
      let later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  action() {
    if (this.watch) {
      this.setState({
        noClamp: false,
      });
      this.clampLines();
      this.setState({ expanded: !this.state.expanded });
    }
  }

  clampLines() {
    if (!this.element) return;

    this.setState({
      text: '',
    });

    let maxHeight = this.lineHeight * this.props.lines + 1;

    this.start = 0;
    this.middle = 0;
    this.end = this.original.length;

    while (this.start <= this.end) {
      this.middle = Math.floor((this.start + this.end) / 2);
      this.element.current.innerText = this.original.slice(0, this.middle);
      if (this.middle === this.original.length) {
        this.setState({
          text: this.original,
          noClamp: true,
        });
        return;
      }

      this.moveMarkers(maxHeight);
    }

    this.element.current.innerText =
      this.original.slice(0, this.middle - 5) + this.getEllipsis();
    this.setState({
      text: this.original.slice(0, this.middle - 5) + this.getEllipsis(),
    });
  }

  moveMarkers(maxHeight) {
    if (this.element.current.clientHeight <= maxHeight) {
      this.start = this.middle + 1;
    } else {
      this.end = this.middle - 1;
    }
  }

  getEllipsis() {
    return this.watch && !this.state.noClamp ? this.props.ellipsis : '';
  }

  render() {
    if (!this.props.text) {
      return null;
    }

    const Element = this.props.component || Text;

    return (
      <Element ref={this.element}>
        {this.state.text}
      </Element>
    );
  }
}

ClampLines.propTypes = {
  text: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  lines: PropTypes.number,
  ellipsis: PropTypes.string,
  className: PropTypes.string,
  delay: PropTypes.number,
  stopPropagation: PropTypes.bool,
  innerElement: PropTypes.string,
};

ClampLines.defaultProps = {
  lines: 3,
  ellipsis: '...',
  delay: 300,
  innerElement: 'div',
  text: ''
};