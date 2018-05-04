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

const RangeTrack = styled.div.attrs({
  style: props => ({
    transform: `translate(0, -50%) scaleX(${props.position})`
  })
})`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  transform-origin: 0 50%;
`;

const RangeRoundContainer = styled.div.attrs({
  style: props => ({
    transform: `translate(${props.position * 100}%, -35%)`
  })
})`
  position: relative;
  width: 100%;
  background: 0 0;
  border: none;
  outline: none;
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
  transform: scale(${props => props.active ? 1 : 0.2})
    translateY(${props => props.active ? '-170%' : '-50%'});
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
  box-shadow: ${props => props.active ? '0 0 0 5px rgba(255, 255, 255, 0.2)' : '0 0 4px rgba(0, 0, 0, 0.5)'};
  transform: translateY(-35%) scale(${props => props.active ? 1 : 0.7});
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
  will-change: transform;
`;

class Range extends Component {
  constructor (props) {
    super(props);

    this.showBigRound = this.showBigRound.bind(this);
    this.removeBigRound = this.removeBigRound.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      position: 0,
      active: false
    }
  }

  componentDidMount () {
    requestAnimationFrame(() => this.update(this.props.value));
  }

  showBigRound (evt) {
    evt.target.focus();
    this.setState({active: true});
  }

  removeBigRound (evt) {
    evt.target.blur();
    this.setState({active: false});
  }

  onChange (evt) {
    const { value } = this.range;
    this.props.onChange(parseInt(value, 10));
    requestAnimationFrame(() => this.update(value));
  }

  update (value) {
    const { min, max } = this.range;
    const position = (parseInt(value, 10) - parseInt(min, 10)) / (parseInt(max, 10) - parseInt(min, 10)); // [0, 1]
    this.setState({position});
  }

  render ({min, max, onChange, value, showToolTip}, {position, active}) {
    return (
      <Container
        innerRef={container => this.container = container}
      >
        <Input
          innerRef={range => this.range = range}
          type="range"
          min={min}
          max={max}
          onChange={this.onChange}
          onMouseDown={this.showBigRound}
          onMouseUp={this.removeBigRound}
          onTouchStart={this.showBigRound}
          onTouchEnd={this.removeBigRound}
          value={value}
        />
        <Track>
          <RangeTrack position={position} />
          <RangeRoundContainer position={position} >
            <RangeToolTip active={active} show={showToolTip}>{value}</RangeToolTip>
            <RangeRound active={active} />
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
