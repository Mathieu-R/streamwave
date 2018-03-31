import { Component } from 'preact';
import { connect } from 'react-redux';
import TopBarHamburger from '../components/topbar-hamburger';
import Range from '../components/range';
import Switch from '../components/switch';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const RangeBound = styled.span`
  display: flex;
  padding: 0 5px;
  font-weight: bold;
`;

const FadeContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
`;

const Fade = styled.div`
  display: flex;
`;

const EqualizeVolume = styled.section`
  display: flex;
  width: 100%;
  padding: 10px 0;
`;

const EQ = styled.section``;

const DownloadQuality = styled.section``;

const DataVolume = styled.section``;

const DataVolumeRange = styled.div``;

const Logout = styled.button`
  padding: 10px 0;
  border-radius: 5px;
  background: ${props => props.theme.primaryColor}
  color: #FFF;
`;

class Settings extends Component {
  constructor () {
    super();
    this.logout = this.logout.bind(this);
  }

  logout (evt) {

  }

  render () {
    return (
      <Container>
        <TopBarHamburger />
        <SettingsContainer>
          <FadeContainer>
            <Label for="fade">Fondu enchainé</Label>
            <Fade>
              <RangeBound>0</RangeBound><Range min={0} max={12} value={5} /><RangeBound>12</RangeBound>
            </Fade>
          </FadeContainer>
          <EqualizeVolume>
            <Switch label="Egaliser le volume sonore"/>
          </EqualizeVolume>
          <EQ>
          </EQ>
          <DownloadQuality>
          </DownloadQuality>
          <DataVolume>
            <Label for="data-volume">Volume de données maximale</Label>
            <DataVolumeRange>
              <RangeBound>0</RangeBound>
              <Range min={0} max={2000} value={0}/>
              <RangeBound>12</RangeBound>
            </DataVolumeRange>
            {/* SVG arc with data consumed until today */}
          </DataVolume>
          <Logout onClick={this.logout}>Déconnexion</Logout>
        </SettingsContainer>
      </Container>
    )
  }
}

export default Settings;
