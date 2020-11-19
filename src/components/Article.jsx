import React, { Component } from 'react'
import { suffixes } from '../helpers/forms'
import Quote from './Quote'
const { DateTime } = require("luxon")

export class Article extends Component {
  renderArticle = () => {
    const { searchValue, showAllForms, content } = this.props;
    const suffixInserts = suffixes.join('|');
    let regExpString;
    if (showAllForms) {
      regExpString = String.raw`\b${searchValue}(?:${suffixInserts})?\b`
    } else {
      regExpString = String.raw`\b${searchValue}\b`
    }

    const regExp = new RegExp(regExpString, "i");
    var separatedSentenceElements = content.split(/(?<=[.!?])/);

    // create array of indexes of sentences matching the search term
    var indexesOfMatchingSentences = [];
    separatedSentenceElements.forEach((sentence, i) => {
      if (regExp.test(sentence)) {
        indexesOfMatchingSentences.push(i)
      }
    })

    // separate the relevant indexes into smaller captureGroups
    var captureGroups = [];
    indexesOfMatchingSentences.forEach(sentenceIndex => {
      if (captureGroups.length === 0) { // first loop through
        captureGroups.push([sentenceIndex])
      } else { // following loops
        var currentCaptureGroup = captureGroups[captureGroups.length-1];
        var mostRecentItem = currentCaptureGroup[currentCaptureGroup.length-1];
        if (sentenceIndex > (mostRecentItem+1)) {
          captureGroups.push([sentenceIndex])
        } else {
          captureGroups[captureGroups.length-1].push(sentenceIndex)
        }
      }
    })

    // for each capture group, render something
    return captureGroups.map(captureGroup => {
      return (
        <Quote
          key = { this.props.key }
          searchValue = { searchValue }
          captureGroup = { captureGroup }
          separatedSentenceElements = { separatedSentenceElements }
          showAllForms = { showAllForms }
        />
      )
    })
  }

  render() {
    const methods = {
      speech: {
        phrase: 'during a speech',
      },
      tweet: {
        phrase: 'in a Tweet',
        link: true,
      },
      statement: {
        phrase: 'in a statement',
        link: false,
      }
    }
    const { date, method } = this.props;
    const formattedDate = DateTime.fromISO(date).toFormat('LL-dd-yyyy');

    return (
      <div className="articleWrapper">
        <div className="articleHead"><b>{ formattedDate }</b>&nbsp;{ methods[method].phrase }</div>
        { this.renderArticle() }
      </div>
    )
  }
}

export default Article