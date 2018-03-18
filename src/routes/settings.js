import { Component } from 'preact';
import { connect } from 'react-redux';
import { TopBarHamburger } from '../components/topbar-hamburger';
import Range from '../components/range';
import Switch from '../components/switch';
import styled from 'styled-components';

const Container = styled.div``;

const Label = styled.label``;

const Fade = styled.section``;

const EqualizeVolume = styled.section``;

const EQ = styled.section``;

const DownloadQuality = styled.section``;

const DataVolume = styled.section``;

const Logout = styled.button`
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
        <Fade>
          <Label for="fade">Fondu enchainé</Label>
          <Range />
        </Fade>
        <EqualizeVolume>
          <Switch label="Egaliser le volume sonore"/>
        </EqualizeVolume>
        <EQ>
        </EQ>
        <DownloadQuality>
        </DownloadQuality>
        <DataVolume>
          <Label for="data-volume">Volume de données maximale</Label>
          <Range />
          {/* SVG arc with data consumed until today */}
        </DataVolume>
        <Logout onClick={this.logout}>Déconnexion</Logout>
      </Container>
    )
  }
}
