import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.text`
  fill: #FFF;
  font-size: 9px;
  text-anchor: middle;
  alignment-baseline: central;
`;

const BaseCircle = styled.circle`
  stroke: #e5e5e5;
  stroke-width: 3;
  fill: none;
  opacity: 0.5;
`;

const CircleProgress = styled.circle`
  stroke: #FFF;
  stroke-width: 3;
  stroke-dasharray: 100;
  transition: stroke-dashoffset .1s linear;
`;

const ProgressRound = ({progress, value, radius}) => {
  return (
    <Container>
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <Text x={radius} y={radius}>
          {value}
        </Text>
        <BaseCircle
          r={radius - 2}
          cx={radius}
          cy={radius}
        />
        <CircleProgress
          r={radius - 2}
          cx={radius}
          cy={radius}
          transform={`rotate(-90, ${radius}, ${radius})`}
          strokeDashoffset={100 - (progress * 100)}
          fill="none"
        />
      </svg>
    </Container>
  );
};

ProgressRound.defaultProps = {
  radius: 16
};

export default ProgressRound;
