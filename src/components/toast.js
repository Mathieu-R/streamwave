import { h, Component } from 'preact';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';

import {
  getMessages,
  getButtons,
  toShow,
  stopToastMessage
 } from '../store/toast';

const Inner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 5px;
  left: 5px;
  right: auto;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  font-size: 15px;
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
    font-size: 14px;
  }
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  font-weight: 400;
  padding-right: 20px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #03A9F4;
  font-size: 16px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    color: #FFF;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    font-size: 15px;
  }
`;

const Content = styled.p`
  margin: 0;
`;

const mapStateToProps = state => ({
  messages: getMessages(state),
  buttons: getButtons(state),
  show: toShow(state)
});

const mapDispatchToProps = dispatch => ({
  hide: _ => dispatch(stopToastMessage())
});

class Toast extends Component {
  constructor () {
    super();
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.messages !== this.props.messages;
  }

  onClick (evt) {
    const action = evt.target.dataset.action.toLowerCase();

    switch (action) {
      case 'dismiss':
        this.props.hide();
        break;
      case 'reload':
        location.reload();
        break;
      default:
        console.error('Action is not supported by the toast.');
    }
  }

  render ({messages, buttons, show}) {
    return (
      <Transition in={show} timeout={300}>
      {state => (
        <Inner state={state} className={state}>
          <Messages>
            {messages.map((message, index) => (
              <Content key={index}>{message}</Content>
            ))}
          </Messages>
          <Buttons>
            {buttons.map((name, index) => (
              <Button key={index} data-action={name} onClick={this.onClick}>{name}</Button>
            ))}
          </Buttons>
        </Inner>
      )}
      </Transition>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
