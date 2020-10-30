import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <div className="ui grid">
        <div className="three column row">
          <div className="column contextButton"><a href="https://google.com">What is this?</a></div>
          <div className="column contextButton"><a href="https://google.com">Something's missing</a></div>
          <div className="column contextButton"><a href="https://google.com">Support us</a></div>
        </div>
      </div>
    )
  }
}

export default Footer
