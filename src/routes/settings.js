import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { clear } from 'idb-keyval';
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
  getDownloadWithMobileNetwork,
  getQuality,
  getLimitDataStatus,
  getDataMax,
  setFade,
  setEqualizeVolume,
  setEqualizer,
  setDownloadWithMobileNetwork,
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
  align-items: flex-start;
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

const RangeBound = styled.span`
  display: flex;
  padding: 0 10px;
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

const DownloadWithMobileNetwork = styled.section`
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
  min-height: 100px;
  max-height: 400px;
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
`;

const SettingsButton = styled.button`
  display: flex;
  align-self: center;
  margin: 10px;
  padding: 10px 25px;
  border-radius: 5px;
  background: ${props => props.theme.primaryColor};
  color: #FFF;
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
  downloadWithMobileNetwork: getDownloadWithMobileNetwork(state),
  quality: getQuality(state),
  limitData: getLimitDataStatus(state),
  dataMax: getDataMax(state),
  userId: getUserId(state)
});

const mapDispatchToProps = dispatch => ({
  setFade: value => dispatch(setFade(value)),
  setEqualizeVolume: status => dispatch(setEqualizeVolume(status)),
  setEqualizer: value => dispatch(setEqualizer(value)),
  setDownloadWithMobileNetwork: value => dispatch(setDownloadWithMobileNetwork(value)),
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

    this.state = {
      volume: 0
    }
  }

  componentWillMount () {
    if (!this.props.dataMax) {
      return;
    }

    getDataVolumeDownloaded({
      userId: this.props.userId
    }).then(({volume}) => {
      this.setState({
        volume
      });
    });
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

  onDownloadWithMobileNetworkChange (evt) {
    const {value} = evt.target;
    this.props.setDownloadWithMobileNetwork(value);
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

  clearCache (evt) {
    // clear idb cache
    clear();
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

  render ({fade, equalizeVolume, eq, downloadWithMobileNetwork, quality, limitData, dataMax}, {volume}) {
    return (
      <Container>
        <TopBarHamburger />
        <SettingsContainer>
          {/* <FadeContainer>
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
          </EqualizeVolume> */}
          {
            Constants.SUPPORT_NETWORK_INFORMATION_API &&
            <DownloadWithMobileNetwork>
              <Switch
                label="Télécharger à l'aide du réseau mobile"
                onChange={this.onDownloadWithMobileNetworkChange}
                value={downloadWithMobileNetwork}
              />
            </DownloadWithMobileNetwork>
          }
          {/* <EQ>
          <LabelInline htmlFor="quality">Equaliseur</LabelInline>
            <Select native onChange={this.onEqualizerChange} value={eq} style={{color: '#FFF'}}>
              <option value="none">Aucun</option>
              <option value="church">Church</option>
              <option value="pop">Pop</option>
              <option value="jazz">Jazz</option>
            </Select>
          </EQ> */}
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
                showTooltip={true}
                onChange={this.onMaxDataVolumeChange}
              />
              <RangeBound>2000mo</RangeBound>
            </DataVolumeRange>
            {/* SVG arc with data consumed until today */}
            {
              limitData &&
              <Circle volume={volume} dataMax={dataMax} />
            }
          </DataVolume>
          <SettingsButton onClick={this.clearCache} aria-label="clear cache">Vider le cache</SettingsButton>
          <SettingsButton onClick={this.logout} aria-label="logout">Déconnexion</SettingsButton>
        </SettingsContainer>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
