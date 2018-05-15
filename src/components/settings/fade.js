import { h, Component } from 'preact';
import styled from 'styled-components';
import Range from '../range';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  padding: 10px 0;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const RangeBound = styled.span`
  display: flex;
  padding: 0 10px;
  font-weight: bold;
`;

const FadeBar = styled.div`
  display: flex;
  align-items: center;
`;

class Fade extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.fade !== nextProps.fade;
  }

  render ({fade, onChange}) {
    return (
      <Container>
        <Label htmlFor="fade">Fondu enchainé</Label>
        <FadeBar>
          <RangeBound>off</RangeBound>
            <Range
              min={0}
              max={12}
              onChange={onChange}
              value={fade}
            />
          <RangeBound>12s</RangeBound>
        </FadeBar>
      </Container>
    );
  }
}

export default Fade;
