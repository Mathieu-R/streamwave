import { h } from 'preact';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #FFF;
`;

const spinner = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const Loader = styled.div`
  display: inline-block;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${props => props.color};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spinner} 1.2s linear infinite;
`;

const Loading = ({error, pastDelay, timedOut}) => (
  <Container>
    {
      // async loading failed
      error ? 'Error ! Please, try refreshing the page.'
      :
      // 200ms loading delay => show a loader
      pastDelay ? <Loader color="#FFF" />
      :
      // connection too slow => timed out
      // need to pass a timeout properties to Loadable (e.g. {timeout: 10000})
      timedOut ? 'You connection seems too slow... Try again later.'
      :
      null
    }
  </Container>
);

export default Loading;
