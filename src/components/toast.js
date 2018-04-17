import { h, Component } from 'preact';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  position: fixed;
  bottom: 5px;
  left: 5px;
  right: auto;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  font-size: 18px;
  background: #323232;
  color: #FFF;
  opacity: 0;
  z-index: 10000;
  transition: opacity .3s cubic-bezier(0, 0, 0.3, 1),
  transform .3s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity, transform;

  &.entered, &.exiting {
    opacity: 1;
    transform: translateY(0);
  }

  &.entering, &.exited {
    opacity: 0;
    transform: translateY(100px);
  }

  @media (max-width: ${props => props.theme.mobile}) {
    left: 0;
    bottom: 0;
    right: 0;
    font-size: 15px;
  }
`;

const Content = styled.p`
  margin: 0;
`;

const mapStateToProps = state => ({
  toast: state.toast
});

const Toast = ({toast}) => (
  <Transition in={toast && toast.show} timeout={300}>
  {state => (
    <Inner state={state} className={state}>
      {toast && toast.messages.map((message, index) => (
        <Content key={index}>{message}</Content>
      ))}
    </Inner>
  )}
  </Transition>
)

export default connect(mapStateToProps)(Toast);
