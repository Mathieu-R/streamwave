import { h, Component } from 'preact';
import styled from 'styled-components';
import Switch from '../switch';
import Range from '../range';
import Circle from '../circle';

const Container = styled.section`
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

const RangeBound = styled.span`
  display: flex;
  padding: 0 10px;
  font-weight: bold;
`;

class DataVolume extends Component {
  shouldComponentUpdate (nextProps) {
    if (this.props.limitData !== nextProps.limitData) {
      return true;
    }

    if (this.props.dataMax !== nextProps.dataMax) {
      return true;
    }

    if (this.props.volume !== nextProps.volume) {
      return true;
    }

    return false;
  }

  render ({limitData, dataMax, volume, onLimitDataStatusChange, onMaxDataVolumeChange}) {
    return (
      <Container>
        <Switch
          label="Volume de données maximale (mo)"
          onChange={onLimitDataStatusChange}
          value={limitData}
        />
        <DataVolumeRange show={limitData}>
          <RangeBound>200mo</RangeBound>
          <Range
            min={200}
            max={2000}
            value={dataMax}
            showTooltip={true}
            onChange={onMaxDataVolumeChange}
          />
          <RangeBound>2000mo</RangeBound>
        </DataVolumeRange>
        {/* SVG arc with data consumed until today */}
        {
          limitData &&
          <Circle volume={volume} dataMax={dataMax} />
        }
      </Container>
    );
  }
}

export default DataVolume;
