import React, { Component } from 'react'
import { Fragment } from 'react';

export class Counter extends Component {
  renderCounters() {
    const { contextLevel, separatedSentenceElements, captureGroup } = this.props;

    const earliestShownIndex = captureGroup[0] - contextLevel < 1 ? 0 : captureGroup[0] - contextLevel;
    const latestShownIndex = captureGroup[0] + contextLevel >= separatedSentenceElements.length ? separatedSentenceElements.length : captureGroup[0] + contextLevel + 1;

    let partsBefore = separatedSentenceElements.slice(0, earliestShownIndex);
    const shownParts = separatedSentenceElements.slice(earliestShownIndex, latestShownIndex);
    let partsAfter = separatedSentenceElements.slice(latestShownIndex, separatedSentenceElements.length);

    let returnArray = [];

    while (returnArray.length < 21 && shownParts.length > 0) {
      returnArray.push(<div className="filledCount"></div>);
      shownParts.splice(0,1);
    }

    while (returnArray.length < 21 && (partsBefore.length > 0 || partsAfter.length > 0)) {

      if (partsBefore.length > 0 && partsAfter.length > 0) {
        returnArray.unshift(<div className="unFilledCount"></div>);
        partsBefore.splice(0,1);
        returnArray.push(<div className="unFilledCount"></div>);
        partsAfter.splice(0,1);
      } else if (partsBefore.length > 0) {
        returnArray.unshift(<div className="unFilledCount"></div>);
        partsBefore.splice(0,1);
      } else {
        returnArray.push(<div className="unFilledCount"></div>);
        partsAfter.splice(0,1);
      }
    }

    return returnArray.map((item, i) => {
      return (
        <Fragment key={i}>{item}</Fragment>
      );
    });
  }
  render() {
    return (
      <div className="counterContainer">
        { this.renderCounters() }
      </div>
    )
  }
}

export default Counter
