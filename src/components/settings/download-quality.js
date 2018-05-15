import { h, Component } from 'preact';
import styled from 'styled-components';
import Select from 'material-ui/Select';

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

class DownloadQuality extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.quality !== nextProps.quality;
  }

  render ({quality, onChange}) {
    return (
      <Container>
        <label for="quality">Qualité de téléchargement</label>
        <Select native onChange={onChange} value={quality} style={{color: '#FFF'}}>
          <option value="128">128k</option>
          <option value="192">192k</option>
          <option value="256">256k</option>
        </Select>
      </Container>
    );
  }
}

export default DownloadQuality;
