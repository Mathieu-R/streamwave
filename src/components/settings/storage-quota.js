import { h, Component } from "preact";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.div`

`;

const Description = styled.p`
  margin: 5px 0;
  font-size: 12px;
`;

const StorageContainer = styled.div`
  position: relative;
  height: 15px;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  margin: 5px 0 10px 0;
`;

const Used = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
`;

const Infos = styled.div`
  display: flex;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  margin-right: 5px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    background: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }
`;

const UsedInfo = styled(Info)`
  &::before {
    background: #FFF;
  }
`;

const QuotaInfo = styled(Info)`
  &::before {
    background: rgba(255, 255, 255, 0.5);
  }
`;

class StorageQuota extends Component {
  constructor () {
    super();
    this.trackUsageBar = null;
    this.state = {};
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.quota !== this.state.quota) {
      return true;
    }

    if (nextState.usage !== this.state.usage) {
      return true;
    }

    return false;
  }

  componentDidMount () {
    navigator.storage.estimate().then(({quota, usage}) => {
      this.setState({
        quota: Math.round(quota / (1000 * 1024)),
        usage: Math.round(usage / (1000 * 1024))
      });

      this.trackUsageBar.style.transform = `scaleX(${usage / quota})`;
    }).catch(err => {
      console.warn('[STORAGE] cannot retrieve storage infos');
      console.error(err);
    });
  }

  render ({}, {quota, usage}) {
    return (
      <Container>
        <Title>Stockage disponible</Title>
        <Description>Le stockage disponible peut varier en fonction des implémentations</Description>
        <StorageContainer>
          <Used innerRef={track => this.trackUsageBar = track} />
        </StorageContainer>
        <Infos>
          <UsedInfo>Utilisé • {usage}mb</UsedInfo>
          <QuotaInfo>Disponible • {quota >= 1000 ? `${quota / 1000}gb` : `${quota}mb`}</QuotaInfo>
        </Infos>
      </Container>
    );
  }
}

export default StorageQuota;
