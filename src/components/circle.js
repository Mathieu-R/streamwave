import { h, Component } from 'preact';
import pure from 'recompose/pure';
import styled from 'styled-components';

const AverageCircle = styled.div`
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFF;
`;

const Percentage = styled.span`
  margin-top: 5px;
  font-size: 20px;
  font-weight: bold;
`;

class Circle extends Component {
  constructor() {
    super();
    this.container = null;
    this.drawProgressively = this.drawProgressively.bind(this);
    this.drawCircle = this.drawCircle.bind(this);

    this.state = {
      volume: 0
    }
  }

  componentDidMount () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    const DPR = window.devicePixelRatio || 1;
    const containerBCR = this.container.getBoundingClientRect();

    this.canvas.width = this.canvas.height = containerBCR.width * DPR;
    this.ctx.scale(DPR, DPR);
    this.container.querySelector('.circle__canvas').appendChild(this.canvas);

    this.drawProgressively();
  }

  componentDidUpdate () {
    //this.drawProgressively();
  }

  drawProgressively () {
    console.log(this.props.percentage);
    for (let percentage = 0; percentage <= this.props.percentage; percentage++) {
      console.log(percentage, this.props.volume, this.props.percentage);
      requestAnimationFrame(_ => {
        setTimeout(_ => {
          this.setState({volume: (this.props.volume / 100) * percentage});
          this.drawCircle(percentage);
        }, 50 * (percentage + 1));
      });
    }
  }

  drawCircle (percentage) {
    const mid = this.canvas.width / 2;
    const lineWidth = 15;
    const radius = (this.canvas.width - lineWidth) / 2;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(mid, mid);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.translate(-mid, -mid);

    this.ctx.beginPath();
    this.ctx.arc(mid, mid, radius, 0, (percentage / 100) * 2 * Math.PI);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = '#FFF';
    this.ctx.stroke();
    this.ctx.restore();
  }

  render({dataMax}, {volume}) {
    return (
      <AverageCircle innerRef={container => this.container = container}>
        <div class='circle__canvas'></div>
        <Infos>
          <Percentage>{volume}mo / {dataMax}mo</Percentage>
        </Infos>
      </AverageCircle>
    )
  }
}

export default pure(Circle);
