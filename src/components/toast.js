import { Component } from 'preact';
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
  right: 5px;
  height: 60px;
  width: 90%;
  max-width: 300px;
  padding: 10px;
  background: #FFF;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  color: #000;
  opacity: 0;
  z-index: 1;
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
    font-size: 14px;
  }
`;

const Content = styled.p`
  margin: 0;
`;

const mapStateToProps = state => ({
  toast: state.toast
});

const Toast = ({toast}) => (
  <Transition in={toast && toast.show} timeout={timeout}>
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
