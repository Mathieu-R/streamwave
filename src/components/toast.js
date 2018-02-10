import { Component } from 'preact';
import { connect } from 'unistore/preact';
import Transition from 'react-transition-group/Transition';

@connect(['toast'])
class Toast extends Component {
  constructor () {
    super();
    this.state = {
      timeout: 300
    }
  }

  render ({toast}, {timeout}) {
    console.log(toast);
    return (
      <div class="toast-container">
        <Transition in={toast && toast.show} timeout={timeout}>
        {state => (
        <div class={`toast toast-${state}`}>
            {toast && toast.messages.map((message, index) => (
              <p class="toast__content" key={index}>{message}</p>
            ))}
          </div>
        )}
        </Transition>
      </div>
    )
  }
}

export default Toast;
