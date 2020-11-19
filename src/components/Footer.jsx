import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <div className="ui grid">
        <div className="three column row">
        <div className="column">What is this?</div>
          <div className="column">Something's missing</div>
          <div className="column">Support us</div>
        </div>
      </div>
    )
  }
}

export default Footer
