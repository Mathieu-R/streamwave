import { h, Component } from 'preact';
import pure from 'recompose/pure';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 10px 0;
`;

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  margin: 0;
  opacity: 0;
  transform: translateY(-50%);
`;

const Track = styled.div`
  position: relative;
  height: 3px;
  width: 100%;
  background: ${props => props.theme.slider.background};
  pointer-events: none;
`;

const RangeTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  transform: translate(0, -50%) scale(0);
  transform-origin: 0 50%;
`;

const RangeRoundContainer = styled.div`
  position: relative;
  width: 100%;
  background: 0 0;
  border: none;
  outline: none;
  transform: translate(0, -50%);
`;

const RangeToolTip = styled.div`
  position: absolute;
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  top: 50%;
  left: -10px;
  height: 20px;
  width: 30px;
  background: #DEDEDE;
  border-radius: 5px;
  color: #000;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.active ? 1 : 0};
  transform: translateY(-50%) scale(0.2);
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
`;

const RangeRound = styled.div`
  position: absolute;
  top: 50%;
  left: -5px;
  height: 15px;
  width: 15px;
  outline: 0;
  border-radius: 50%;
  background: #FFF;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  transform: translateY(-35%) scale(0.7);
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
`;

class Range extends Component {
  constructor (props) {
    super(props);

    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      position: 0,
      active: false
    }
  }

  componentDidMount () {
    requestAnimationFrame(() => this.update(this.props.value));
  }

  highlight (evt) {
    evt.target.focus();
    this.tooltip.classList.add('show-tooltip');
    this.innerRound.classList.add('highlight-round');
  }

  unhighlight (evt) {
    evt.target.blur();
    this.tooltip.classList.remove('show-tooltip');
    this.innerRound.classList.remove('highlight-round');
  }

  onChange (evt) {
    const { value } = this.range;
    this.props.onChange(parseInt(value, 10));
    requestAnimationFrame(() => this.update(value));
  }

  update (value) {
    const { min, max } = this.range;
    const position = (parseInt(value, 10) - parseInt(min, 10)) / (parseInt(max, 10) - parseInt(min, 10)); // [0, 1]
    this.track.style.transform = `translate(0, -50%) scaleX(${position})`;
    this.round.style.transform = `translate(${position * 100}%, -35%)`;
  }

  render ({min, max, onChange, value, showToolTip}, {position, active}) {
    return (
      <Container
        innerRef={container => this.container = container}
        className="range-bar"
      >
        <Input
          innerRef={range => this.range = range}
          type="range"
          min={min}
          max={max}
          onChange={this.onChange}
          onMouseDown={this.highlight}
          onMouseUp={this.unhighlight}
          onTouchStart={this.showBigRound}
          onTouchEnd={this.removeBigRound}
          value={value}
        />
        <Track>
          <RangeTrack innerRef={track => this.track = track} />
          <RangeRoundContainer innerRef={round => this.round = round} >
            <RangeToolTip innerRef={tooltip => this.tooltip = tooltip}>{value}</RangeToolTip>
            <RangeRound innerRef={round => this.innerRound = round} />
          </RangeRoundContainer>
        </Track>
      </Container>
    )
  }
}

Range.defaultProps = {
  min: 0,
  value: 100,
  showToolTip: true
}

export default pure(Range);
