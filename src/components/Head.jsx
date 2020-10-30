import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

export class Head extends Component {
  render() {
    return (
      <div className="header">
        <Header as="h2" className="headerText">WHAT THEY SAID</Header>
        <small>No bias, nothing added, EVER. Just what they said.</small>
      </div>
    )
  }
}

export default Head
