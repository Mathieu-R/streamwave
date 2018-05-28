import { h, Component } from 'preact';

class Range extends Component {
  constructor (props) {
    super(props);

    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      position: 0,
      active: false
    }
  }

  componentDidMount () {
    requestAnimationFrame(() => this.update(this.props.value));
  }

  highlight (evt) {
    evt.target.focus();
    this.tooltip.classList.add('range__tooltip--active');
    this.innerRound.classList.add('highlight-round');
  }

  unhighlight (evt) {
    evt.target.blur();
    this.tooltip.classList.remove('range__tooltip--active');
    this.innerRound.classList.remove('highlight-round');
  }

  onChange (evt) {
    console.log('change');
    const { value } = this.range;
    this.props.onChange(parseInt(value, 10));
    requestAnimationFrame(() => this.update(value));
  }

  update (value) {
    const { min, max } = this.range;
    const position = (parseInt(value, 10) - parseInt(min, 10)) / (parseInt(max, 10) - parseInt(min, 10)); // [0, 1]
    this.track.style.transform = `translate(0, -50%) scaleX(${position})`;
    this.round.style.transform = `translate(${position * 100}%, -35%)`;
  }

  render ({min, max, onChange, value, showToolTip}, {position, active}) {
    return (
      <div
        class="range"
        ref={container => this.container = container}
      >
        <input
          type="range"
          class="range__input"
          ref={range => this.range = range}
          min={min}
          max={max}
          onInput={this.onChange}
          onMouseDown={this.highlight}
          onMouseUp={this.unhighlight}
          onTouchStart={this.showBigRound}
          onTouchEnd={this.removeBigRound}
          value={value}
        />
        <div class="range__ui-container">
          <div class="range__track" ref={track => this.track = track} />
          <div class="range__round-container" ref={round => this.round = round} >
            <div class={
              showToolTip ?
              'range__tooltip range__tooltip--visible' :
              'range__tooltip'
            } ref={tooltip => this.tooltip = tooltip}>{value}</div>
            <div class="range__round" ref={round => this.innerRound = round} />
          </div>
        </div>
      </div>
    )
  }
}

Range.defaultProps = {
  min: 0,
  value: 100,
  showToolTip: true
}

export default Range;
