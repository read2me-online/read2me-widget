import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
  static propTypes = {
    hello: PropTypes.string.isRequired
  };
  state = {
    open: true
  };
  toggle = () => {
    this.setState({ open: !this.state.open });
  };
  showAlert = () => {
    alert('whatever');
  };
  render() {
    return (
      <div>
        <span onClick={this.toggle}>{this.props.hello}</span>
        <div
          style={{
            display: this.state.open ? 'block' : 'none'
          }}
        >
          {`This is when it's open`}
        </div>
      </div>
    );
  }
}

export default Button;
