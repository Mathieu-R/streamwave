import { h, Component } from 'preact';
import styled from 'styled-components';
import TopBarHamburger from '../components/topbar-hamburger';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Bitrate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const Title = styled.span`
  font-size: 32px;
  color: #DEDEDE;
`;

const Content = styled.span`
  font-size: 16px;
`;

const CanvasContainer = styled.section`
  width: 100%;
  height: 50px;
`;

class Demo extends Component {
  constructor () {
    super();
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.width = null;
    this.height = null;

    this.bandwidth = 0;
    this.maxBandwidth = 60; // 60 mo/s

    this.state = {
      bitrate: 256
    };

    this.onResize = this.onResize.bind(this);
    this.draw = this.draw.bind(this);
  }

  static get BITRATE () {
    return [128, 192, 256];
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.bitrate !== nextState.bitrate;
  }

  componentDidMount () {
    window.addEventListener('resize', this.onResize);
    this.addEventListeners();
    requestAnimationFrame(this.onResize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize);
  }

  addEventListeners () {
    // listen to shaka-player adaptation
    player.addEventListener('adaptation', () => {
      const bandwidth = player.getStats().estimatedBandwidth / (1024 * 1000);
      this.bandwidth = Math.min(bandwidth, this.maxBandwidth);

      // active track is the "active bitrate"
      // sort by bandwidth since more bandwidth = better quality
      // and no better informations to know the bitrate
      // that's for demo sake so don't care
      const tracks = player.getVariantTracks().sort((a, b) => a.bandwidth - b.bandwidth);
      const activeTrack = tracks.findIndex(t => t.active);
      const bitrate = Demo.BITRATE[activeTrack];
      this.setState({bitrate});
      requestAnimationFrame(this.draw);
    });
  }

  onResize () {
    const DPR = window.devicePixelRatio || 1;
    const bcr = this.container.getBoundingClientRect();
    this.width = bcr.width;
    this.height = bcr.height;

    this.canvas.width = this.width * DPR;
    this.canvas.height = this.height * DPR;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(DPR, DPR);

    this.draw();
  }

  draw () {
    const padding = 10;
    const width = this.width - (2 * padding);
    const height = this.height;

    const midX = this.width / 2;
    const midY = this.height / 2;

    // bandwidth percentage [0, 1]
    const bandwidth = this.bandwidth / this.maxBandwidth;

    // remove old canvas
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);

    // semi-transparent bar
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#38B88A';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    // top-left (x, y), width, height
    this.ctx.fillRect(padding, 0, width, this.height);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = `rgb(${Math.round(bandwidth * 255)},0 , 128)`;
    this.ctx.rect(padding, 0, width * bandwidth, this.height);
    this.ctx.lineWidth = 0;
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.save();

    // text => downloaded - max data allowed
    const fontSize = '16px';
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = `${fontSize} Helvetica Neue`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'center';
    this.ctx.fillText(`${Math.round(this.bandwidth * 100) / 100} mo/s`, midX, midY + 5);
    this.ctx.restore();
  }

  render ({}, {bitrate}) {
    return (
      <Container>
        <TopBarHamburger />
        <Wrapper>
          <Bitrate>
            <Title>Bitrate</Title>
            <Content>{bitrate} kb/s</Content>
          </Bitrate>
          <CanvasContainer innerRef={container => this.container = container}>
            <canvas ref={canvas => this.canvas = canvas}></canvas>
          </CanvasContainer>
        </Wrapper>
      </Container>
    );
  }
}

export default Demo;
