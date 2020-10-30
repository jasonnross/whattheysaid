import React, { Component } from 'react'
import { FaMinus, FaPlus, FaShareAlt } from 'react-icons/fa'
import { Divider } from 'semantic-ui-react'
import _ from 'lodash'
const { DateTime } = require("luxon")

export class Article extends Component {
  state = {
    contextLevel: 1
  }

  renderArticle = () => {
    const { searchValue, content } = this.props;
    const { contextLevel } = this.state;
    const regex = new RegExp(`(\\b${searchValue}\\b)`, 'i');
    var separatedSentenceElements = content.split(/([?.!])/g);

    // initially separate sentences by punctuation
    separatedSentenceElements.forEach((element, i) => {
      if (['.','!','?'].includes(element)) {
        separatedSentenceElements[i-1] = separatedSentenceElements[i-1].concat(element);
        separatedSentenceElements.splice(i, 1);
      }
    });
    var indexesOfMatchingSentences = [];

    // create array of indexes of sentences matching the search term
    separatedSentenceElements.forEach((sentence, i) => {
      if (regex.test(sentence)) {
        indexesOfMatchingSentences.push(i)
      }
    })

    // separate the relevant indexes into smaller captureGroups
    var captureGroups = [];
    indexesOfMatchingSentences.forEach(sentenceIndex => {
      if (captureGroups.length === 0) { // first loop thru
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
      const indexOfEarliestMention = captureGroup[0];
      const indexOfLatestMention = captureGroup[captureGroup.length - 1];
      const maximumIndexOfSentence = separatedSentenceElements.length;
      const targetBeginningIndex = (indexOfEarliestMention - contextLevel) < 0 ? 0 : indexOfEarliestMention - contextLevel;
      const targetEndIndex = (indexOfLatestMention + 1 + contextLevel) > maximumIndexOfSentence ? maximumIndexOfSentence : indexOfLatestMention + 1 + contextLevel;
      const arrayToUse = separatedSentenceElements.slice(targetBeginningIndex, targetEndIndex);
      arrayToUse[0] = arrayToUse[0].trim()

      const returnContent = arrayToUse.map((sentence, i) => {
        if (_.indexOf(['.','!','?'], sentence) !== -1) {
          return sentence
        } else {
          const sentenceSplitByTerm = sentence.split(regex);
          return sentenceSplitByTerm.map(section => {
            if (section === searchValue) {
              return <span key={ searchValue } className="highlightSearchTerm">{ searchValue }</span>
            } else {
              return (i === 0 ? section : section)
            }
          })
        }
      })

      return (
        <div key={ this.props.key } className="result">
          <div className="resultContent">
            "{ returnContent }"
          </div>
          <Divider />
          <div className="ui grid">
            <div className="three column row buttonRow">
              <div className="column contextButton"><FaMinus />Less Context</div>
              <div className="column contextButton"><FaPlus />More Context</div>
              <div className="column contextButton"><FaShareAlt />Share</div>
            </div>
          </div>
        </div>
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
