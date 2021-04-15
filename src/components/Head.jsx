import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

export class Head extends Component {
  render() {
    return (
      <div className="header">
        <Link to="/"><Header as="h2" className="headerText">What They Said</Header></Link>
      </div>
    )
  }
}

export default Head
