import React, { Component } from 'react'
import { suffixes } from '../helpers/forms'
import Quote from './Quote'
import { Fragment } from 'react'
import { FaTwitter, FaMicrophone, FaNewspaper, FaHandshake } from 'react-icons/fa';
const { DateTime } = require("luxon")

export class Article extends Component {
  renderQuotes = () => {
    const { searchValue, showAllForms, articleData } = this.props;
    const suffixInserts = suffixes.join('|');
    let regExpString;
    if (showAllForms) {
      regExpString = String.raw`\b${searchValue}(?:${suffixInserts})?\b`
    } else {
      regExpString = String.raw`\b${searchValue}\b`
    }

    const regExp = new RegExp(regExpString, "i");
    const articleContent = articleData?.content;
    const articleContentArray = articleData?.content_array;

    if (articleContentArray.length > 0) {
      console.log('yay');
    }

    const separatedSentenceElements = articleContent.split(/(?<=[.!?])/);

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


    // for each capture group, render a quote
    return captureGroups.map((captureGroup, i) => {
      return (
        <Fragment key = { `${articleData._id}${i}` }>
          <Quote
            articleData = { articleData }
            searchValue = { searchValue }
            captureGroup = { captureGroup }
            separatedSentenceElements = { separatedSentenceElements }
            showAllForms = { showAllForms }
          />
        </Fragment>
      )
    })
  }

  render() {
    const { articleData, personData } = this.props;
    const { date, type: method, _id: articleId } = articleData;
    const name = `${personData.first_name} ${personData.last_name}`;

    const methods = {
      speech: {
        name: 'Speech',
        phrase: 'during a speech',
        link: false,
        symbol: FaMicrophone,
        symbolClassName: 'speechSymbol',
        foreword: 'by',
      },
      tweet: {
        name: 'Tweet',
        phrase: 'in a Tweet',
        link: true,
        symbol: FaTwitter,
        symbolClassName: 'tweetSymbol',
        foreword: 'by',
      },
      statement: {
        name: 'Statement',
        phrase: 'in a statement',
        link: false,
        symbol: FaNewspaper,
        symbolClassName: 'statementSymbol',
        foreword: 'by',
      },
      interview: {
        name: 'Interview',
        phrase: 'in an interview',
        link: false,
        foreword: 'with',
        symbol: FaHandshake,
        symbolClassName: 'interviewSymbol',
        postword: `(said by ${ name })`,
      }
    }
    const formattedDate = DateTime.fromISO(date).toFormat('DDD');
    const Symbol = methods[method].symbol;

    function renderArticleButtons() {
      let articleButtons = [];
      if (articleData.type === 'tweet') {
        articleButtons.push(<a href={ `https://twitter.com/${ personData.handles.twitter }/status/${ articleData.resource_id }` } target="_blank" rel="noopener noreferrer">Source</a>)
      }
      articleButtons.push(<a className="reportAProblem" href={ `https://twitter.com/${ personData.handles.twitter }/status/${ articleData.resource_id }` } target="_blank" rel="noopener noreferrer">Report a problem</a>)
      const spacing = <Fragment>&nbsp;&#xB7;&nbsp;&nbsp;</Fragment>
      return articleButtons.map((item, i) => {
        if (i !== articleButtons.length - 1) {
          return (
            <Fragment key={ i }>{ item } { spacing }</Fragment>
          )
        } else {
          return item
        }
      })
    }

    return (
      <div className="articleWrapper" key={ articleId }>
        <div className="articleHead">
          <div className="articleTypeSymbol"><Symbol className={ methods[method].symbolClassName }/></div>
          <div className="articleHeadContent">
            <span className="articleHeadHeader">{ methods[method].name }</span>
            <span className="articleHeadTag">{ methods[method].foreword } { name } on { formattedDate } { methods[method]?.postword ?? '' }</span>
            <div className="articleLinks">
              { renderArticleButtons() }
            </div>
          </div>
        </div>
        { this.renderQuotes() }
      </div>
    )
  }
}

export default Article