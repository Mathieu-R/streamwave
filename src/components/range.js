import { Component } from 'preact';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 10px 0;
`;

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
`;

const Track = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
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
    transform: `translateX(${props.position * 100}%, -50%)`
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
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10px;

  height: 20px;
  width: 40px;
  background: ${props => props.theme.slider.background};
  border-radius: 5px;
  color: #FFF;
`;

const RangeRound = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background: #FFF;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  transform: translateY(-50%);
`;

class Range extends Component {
  constructor () {
    super();

    this.onChange = this.onChange.bind(this);

    this.state = {
      dragging: false,
      bcr: null,
      position: 0
    }
  }

  onChange (evt) {
    const { min, max, value } = this.range;
    const position = (parseInt(value, 10) - parseInt(min, 10)) / (parseInt(max, 10) - parseInt(min, 10)); // [0, 1]
    this.setState({position});
  }

  render ({min, max, value, onChange}, {position}) {
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
          defaultValue={value}
        />
        <Track>
          <RangeTrack position={position} />
          <RangeRoundContainer position={position}>
            <RangeToolTip>{value}</RangeToolTip>
            <RangeRound />
          </RangeRoundContainer>
        </Track>
      </Container>
    )
  }
}

Range.defaultProps = {
  min: 0,
  value: 0
}

export default Range;