import { Component } from 'preact';

class Toast extends Component {
  render ({toast}, {}) {
    return (
      <div class="toast-container">
        <div class="toast">
          {toast.messages.map((message, index) => (
            <p class="toast--content" key={index}>{message}</p>
          ))}
        </div>
      </div>
    )
  }
}

export default Toast;
