import React, { PureComponent } from 'react'

type State = {
  expanded: boolean
  noClamp: boolean
  text: string
}

type Props = {
  text: string
  Component: any
  lines?: number
  ellipsis?: string
  className?: string
  delay?: number
  stopPropagation?: boolean
}

class ClampLines extends PureComponent<Props, State> {
  element: React.RefObject<any>
  original: string
  watch: boolean
  lineHeight: number
  start: number
  middle: number
  end: number

  constructor(props: Props) {
    super(props)

    this.element = React.createRef()
    this.original = props.text
    this.watch = true
    this.lineHeight = 0
    this.start = 0
    this.middle = 0
    this.end = 0
    this.state = {
      expanded: true,
      noClamp: false,
      text: props.text.substring(0, 20)
    }

    this.action = this.action.bind(this)
    this.debounced = this.debounce(this.action, props.delay || 300)
  }

  // just here so it works type wise
  debounced() {}

  componentDidMount() {
    if (this.props.text) {
      this.lineHeight = this.element.current.clientHeight + 1
      this.clampLines()

      if (this.watch) {
        window.addEventListener('resize', this.debounced)
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounced)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.original = this.props.text
      this.clampLines();
    }
  }

  debounce(func: any, wait: number, immediate?: boolean) {
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
    })

    let maxHeight = this.lineHeight * (this.props.lines || 3) + 1;

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
    return this.watch && !this.state.noClamp ? (this.props.ellipsis || '...') : '';
  }

  render() {
    const { text, Component } = this.props;

    if (!text || !Component)
      return null

    return (
      <Component ref={this.element}>
        {this.state.text}
      </Component>
    )
  }
}

export default ClampLines