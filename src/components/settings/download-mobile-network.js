import { h, Component } from 'preact';
import styled from 'styled-components';
import Switch from '../switch';

const Container = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 50px;
  padding: 10px 0;
`;

class DownloadWithMobileNetwork extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.value !== nextProps.value;
  }

  render ({value, onChange}) {
    return (
      <Container>
        <Switch
          label="Télécharger à l'aide du réseau mobile"
          onChange={this.onChange}
          value={value}
        />
      </Container>
    );
  }
}

export default DownloadWithMobileNetwork;
