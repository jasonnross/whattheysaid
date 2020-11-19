import React, { Component } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

export class Head extends Component {
  render() {
    return (
      <div className="header">
        <Router forceRefresh={true}>
          <Link to="/"><Header as="h2" className="headerText">WHAT THEY SAID</Header></Link>
        </Router>
      </div>
    )
  }
}

export default Head
