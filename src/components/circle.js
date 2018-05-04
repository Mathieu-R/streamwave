import { h, Component } from 'preact';
import pure from 'recompose/pure';
import styled from 'styled-components';

const AverageCircle = styled.div`
  margin: 0 auto;
  width: 100%;
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
    this.canvas = null;
    this.draw = this.draw.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount () {
    window.addEventListener('resize', this.onResize);
    requestAnimationFrame(() => this.onResize());
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate () {
    requestAnimationFrame(() => this.draw());
  }

  onResize () {
    // remove the canvas to avoid screen flickering
    this.canvas.style.display = 'none';

    const DPR = window.devicePixelRatio || 1;
    const containerBCR = this.container.getBoundingClientRect();
    this.canvas.width = this.canvas.height = containerBCR.height * DPR;
    this.canvas.style.width = this.canvas.style.height = `${containerBCR.height}px`;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(DPR, DPR);

    this.canvas.style.display = 'block';

    this.draw();
  }

  draw () {
    const TAU = Math.PI * 2;
    const mid = this.canvas.height / 4;
    const lineWidth = 15;
    const radius = (this.canvas.height - lineWidth) / 4;
    const innerRadius = radius - lineWidth;
    const percentage = this.props.volume / this.props.dataMax;

    // remove old canvas
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // semi-transparent circle
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.arc(mid, mid, radius, 0, TAU);
    this.ctx.lineWidth = lineWidth;
    this.ctx.closePath();
    this.ctx.fill();

    // move the origin at the center of the circle
    this.ctx.translate(mid, mid);
    // rotate (-90deg) around the center of the circle
    // that's why we translated before
    this.ctx.rotate(-Math.PI / 2);
    // move back the origin at 0,0 (top-left corner)
    this.ctx.translate(-mid, -mid);

    // filled circle
    this.ctx.beginPath();
    this.ctx.moveTo(mid, mid);
    this.ctx.arc(mid, mid, radius, 0, percentage * TAU);
    this.ctx.lineWidth = lineWidth;
    this.ctx.fillStyle = `rgb(${Math.round(percentage * 255)}, 255 , 128)`;
    this.ctx.closePath();
    this.ctx.fill();

    // inner to remove overlaping
    // keep the existing content where it does not overlap
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(mid, mid, innerRadius, 0, TAU);
    this.ctx.closePath();
    this.ctx.fill();

    // inner to allow to write text
    this.ctx.beginPath();
    this.ctx.moveTo(mid, mid);
    this.ctx.arc(mid, mid, innerRadius, 0, TAU);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    // text => downloaded - max data allowed
    this.ctx.translate(mid, mid);
    this.ctx.rotate(Math.PI / 2);
    this.ctx.translate(-mid, -mid);
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '18px Helvetica Neue';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'center';
    this.ctx.fillText(`${this.props.volume} mo / ${this.props.dataMax} mo`, mid, mid);
    this.ctx.restore();
  }

  render () {
    return (
      <AverageCircle innerRef={container => this.container = container}>
        <canvas ref={canvas => this.canvas = canvas}></canvas>
      </AverageCircle>
    )
  }
}

/**
 * Props
 * volume => 2 decimal float in Mo
 * dataMax => integer in Mo
 */

export default pure(Circle);
