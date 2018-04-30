import { h, Component } from 'preact';
import { connect } from 'react-redux';
import TopBarHamburger from '../components/topbar-hamburger';
import Range from '../components/range';
import Switch from '../components/switch';
import Select from 'material-ui/Select';
import Circle from '../components/circle';
import { getDataVolumeDownloaded } from '../utils/download';
import styled from 'styled-components';
import Constants from '../constants';

import {
  getFade,
  getEqualizeVolume,
  getEq,
  getQuality,
  getLimitDataStatus,
  getDataMax,
  setFade,
  setEqualizeVolume,
  setEqualizer,
  setDownloadQuality,
  setLimitDataStatus,
  setMaxDataVolume,
} from '../store/settings';

import {
  getUserId
} from '../store/user';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const LabelInline = styled.label`
`;

// const Select = styled.select`
//   color: #000;
// `;

const RangeBound = styled.span`
  display: flex;
  padding: 0 5px;
  font-weight: bold;
`;

const FadeContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  padding: 10px 0;
`;

const Fade = styled.div`
  display: flex;
  align-items: center;
`;

const EqualizeVolume = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 50px;
  padding: 10px 0;
`;

const EQ = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

const DownloadQuality = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

const DataVolume = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 50px;
  padding: 10px 0;
`;

const DataVolumeRange = styled.section`
  display: flex;
  align-items: center;
  min-height: 50px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity;
`;

const Logout = styled.button`
  display: flex;
  align-self: center;
  margin: 10px;
  padding: 10px 25px;
  border-radius: 5px;
  background: ${props => props.theme.primaryColor};
  color: #FFF;
`;

const mapStateToProps = state => ({
  fade: getFade(state),
  equalizeVolume: getEqualizeVolume(state),
  eq: getEq(state),
  quality: getQuality(state),
  limitData: getLimitDataStatus(state),
  dataMax: getDataMax(state),
  userId: getUserId(state)
});

const mapDispatchToProps = dispatch => ({
  setFade: value => dispatch(setFade(value)),
  setEqualizeVolume: status => dispatch(setEqualizeVolume(status)),
  setEqualizer: value => dispatch(setEqualizer(value)),
  setDownloadQuality: quality => dispatch(setDownloadQuality(quality)),
  setLimitDataStatus: status => dispatch(setLimitDataStatus(status)),
  setMaxDataVolume: value => dispatch(setMaxDataVolume(value))
});

class Settings extends Component {
  constructor () {
    super();

    this.logout = this.logout.bind(this);
    this.onFadeChange = this.onFadeChange.bind(this);
    this.onEqualizeVolumeChange = this.onEqualizeVolumeChange.bind(this);
    this.onEqualizerChange = this.onEqualizerChange.bind(this);
    this.onQualityChange = this.onQualityChange.bind(this);
    this.onLimitDataStatusChange = this.onLimitDataStatusChange.bind(this);
    this.onMaxDataVolumeChange = this.onMaxDataVolumeChange.bind(this);
  }

  componentWillMount () {
    if (!this.props.dataMax) {
      return;
    }

    getDataVolumeDownloaded({
      userId: this.props.userId,
      dataMax: this.props.dataMax
    }).then(({volume, percentage}) => {
      this.setState({
        volume,
        percentage
      });
    })
  }

  onFadeChange (value) {
    // avoid unnecessary update
    if (value === this.props.fade) {
      return;
    }

    this.props.setFade(value);
  }

  onEqualizeVolumeChange (evt) {
    const status = evt.target.checked;
    this.props.setEqualizeVolume(status);
  }

  onEqualizerChange (evt) {
    const {value} = evt.target;
    this.props.setEqualizer(value);
  }

  onQualityChange (evt) {
    const {value} = evt.target;
    this.props.setDownloadQuality(value)
  }

  onLimitDataStatusChange (evt) {
    const status = evt.target.checked;
    this.props.setLimitDataStatus(status);
  }

  onMaxDataVolumeChange (value) {
    this.props.setMaxDataVolume(value);
  }

  logout (evt) {
    if (Constants.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      // disable auto signin next visite
      // until user signin again
      navigator.credentials.preventSilentAccess().then(_ => {
        localStorage.removeItem('streamwave-token');
        this.props.history.push('/auth');
      });
    }
  }

  render ({fade, equalizeVolume, eq, quality, limitData, dataMax}, {volume, percentage}) {
    console.log('LIMIT DATA', limitData);
    console.log('DATA MAX', dataMax);
    console.log('VOLUME DOWNLOADED', volume);
    console.log('PERCENTAGE DOWNLOADED', percentage);
    return (
      <Container>
        <TopBarHamburger />
        <SettingsContainer>
          <FadeContainer>
            <Label htmlFor="fade">Fondu enchainé</Label>
            <Fade>
              <RangeBound>off</RangeBound>
                <Range
                  min={0}
                  max={12}
                  onChange={this.onFadeChange}
                  value={fade}
                />
              <RangeBound>12s</RangeBound>
            </Fade>
          </FadeContainer>
          <EqualizeVolume>
            <Switch
              label="Egaliser le volume sonore"
              onChange={this.onEqualizeVolumeChange}
              value={equalizeVolume}
            />
          </EqualizeVolume>
          <EQ>
          <LabelInline htmlFor="quality">Equaliseur</LabelInline>
            <Select native onChange={this.onEqualizerChange} value={eq} style={{color: '#FFF'}}>
              <option value="none">Aucun</option>
              <option value="church">Church</option>
              <option value="pop">Pop</option>
              <option value="jazz">Jazz</option>
            </Select>
          </EQ>
          <DownloadQuality>
            <LabelInline htmlFor="quality">Qualité de téléchargement</LabelInline>
            <Select native onChange={this.onQualityChange} value={quality.toString()} style={{color: '#FFF'}}>
              <option value="128">128k</option>
              <option value="192">192k</option>
              <option value="256">256k</option>
            </Select>
          </DownloadQuality>
          <DataVolume>
            <Switch
              label="Volume de données maximale (mo)"
              onChange={this.onLimitDataStatusChange}
              value={limitData}
            />
            <DataVolumeRange show={limitData}>
              <RangeBound>200mo</RangeBound>
              <Range
                min={200}
                max={2000}
                value={dataMax}
                onChange={this.onMaxDataVolumeChange}
              />
              <RangeBound>2000mo</RangeBound>
            </DataVolumeRange>
            {/* SVG arc with data consumed until today */}
            {
              limitData &&
              <Circle percentage={percentage} volume={volume} dataMax={dataMax} />
            }
          </DataVolume>
          <Logout onClick={this.logout} aria-label="logout">Déconnexion</Logout>
        </SettingsContainer>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
