import React, { Component } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import { supplyAllForms } from '../helpers/forms';
import Counter from './Counter';

export class Quote extends Component {
  state = {
    contextLevel: 1,
    mouseOnContext: false,
    contentBeforeResize: null,
    lastHeight: null,
  }

  mouseEnterExitContextButtons = (enterExit) => {
    this.setState({ mouseOnContext: JSON.parse(enterExit) })
  }

  alterContextLevel = (adjust) => {
    const { contextLevel } = this.state;
    this.checkSizeOnChange();

    const { captureGroup, articleData } = this.props;
    const thisContentsId = `${articleData._id}-${captureGroup}`;
    const thisContentsHeight = document.getElementById(thisContentsId).clientHeight;

    this.setState({
      contextLevel: contextLevel + adjust,
      lastHeight: thisContentsHeight
    })
  }

  checkSizeOnChange() {
    const { captureGroup, articleData } = this.props;
    const thisContentsId = `${articleData._id}-${captureGroup}`;
    const thisContentsHeight = document.getElementById(thisContentsId).clientHeight;
    this.setState({ explicitHeight: thisContentsHeight })
  }

  componentDidUpdate() {
    const { lastHeight } = this.state;
    const { captureGroup, articleData } = this.props;
    const thisContentsId = `${articleData._id}-${captureGroup}`;
    const thisContentsHeight = document.getElementById(thisContentsId).clientHeight;

    if (lastHeight !== thisContentsHeight) {
      // console.log('content did resize the window')
      // this.setState({ contentHeightChanged: true })
    } else {
      // console.log('content did not resize the window')
      // this.setState({ contentHeightChanged: false })
    }
    // console.log(thisContentsHeight);

  }

  render() {
    const { contextLevel } = this.state;
    const { searchValue, captureGroup, separatedSentenceElements, showAllForms, articleData } = this.props;

    const indexOfEarliestMention = captureGroup[0];
    const indexOfLatestMention = captureGroup[captureGroup.length - 1];
    const maximumIndexOfSentence = separatedSentenceElements.length;
    const targetBeginningIndex = (indexOfEarliestMention - contextLevel) < 0 ? 0 : indexOfEarliestMention - contextLevel;
    const targetEndIndex = (indexOfLatestMention + 1 + contextLevel) > maximumIndexOfSentence ? maximumIndexOfSentence : indexOfLatestMention + 1 + contextLevel;
    const arrayToUse = separatedSentenceElements.slice(targetBeginningIndex, targetEndIndex);
    arrayToUse[0] = arrayToUse[0].trim();


    const possibleForms = supplyAllForms(searchValue);
    const regExpSplitString = showAllForms ? new RegExp('\\b('+possibleForms.join('|')+')\\b', "i") : new RegExp('\\b('+searchValue+')\\b', "i")

    const returnContent = arrayToUse.map((sentence, i) => {
      const sentenceSplitByTerm = sentence.split(regExpSplitString)
      return sentenceSplitByTerm.map((section, i) => {
        if (regExpSplitString.test(section)) {
          return <span key={ searchValue+i } className="highlightSearchTerm">{ section }</span>
        } else {
          return <span key={ section+i }>{section}</span>
        }
      })
    })

    const allowContextDecrease = !!(contextLevel > 1);
    const allowContextIncrease = !!((arrayToUse.length < 21) && arrayToUse.length < separatedSentenceElements.length);

    const articleId = articleData._id;;

    return (
      <div className="result">
        <Link className="overrideLinkStyling" to={`/quote?article_id=${articleData._id}&capture_groups=${captureGroup}&context_level=${contextLevel}&search_value=${searchValue}`}>
          <div className="resultContent" id={ `${articleId}-${captureGroup}` } >
            "{ returnContent }"
          </div>
        </Link>
        <Divider />
        <div className="ui grid">
          <div className="three column row buttonRow">
            {allowContextDecrease && <div className="column contextButton" onMouseEnter={ () => this.mouseEnterExitContextButtons('true') } onMouseLeave={ () => this.mouseEnterExitContextButtons('false') } onClick={ () => this.alterContextLevel(-1) }><FaMinus />Less context</div>}
            {!allowContextDecrease && <div className="column contextButtonDisabled" onMouseEnter={ () => this.mouseEnterExitContextButtons('true') } onMouseLeave={ () => this.mouseEnterExitContextButtons('false') }><FaMinus />Less context</div>}
            <div className="column contextCounter"><Counter contextLevel={ contextLevel } separatedSentenceElements={ separatedSentenceElements } captureGroup={ captureGroup }/></div>
            {allowContextIncrease && <div className="column contextButton" onMouseEnter={ () => this.mouseEnterExitContextButtons('true') } onMouseLeave={ () => this.mouseEnterExitContextButtons('false') } onClick={ () => this.alterContextLevel(+1) }><FaPlus />More context</div>}
            {!allowContextIncrease && <div className="column contextButtonDisabled" onMouseEnter={ () => this.mouseEnterExitContextButtons('true') } onMouseLeave={ () => this.mouseEnterExitContextButtons('false') }><FaPlus />More context</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Quote
