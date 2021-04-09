import React, { Component } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import { supplyAllForms } from '../helpers/forms';
import Counter from './Counter';

export class Quote extends Component {
  state = {
    contextLevel: 1,
  }

  alterContextLevel = (adjust) => {
    const { contextLevel } = this.state;
    this.setState({
      contextLevel: contextLevel + adjust,
    })
  }

  render() {
    const { contextLevel } = this.state;
    const { searchValue, captureGroup, separatedSentenceElements, showAllForms, articleData } = this.props;
    console.log('sentence array', separatedSentenceElements);
    console.log('capture group', captureGroup);
    const indexOfEarliestMention = captureGroup[0];
    const indexOfLatestMention = captureGroup[captureGroup.length - 1];
    const maximumIndexOfSentence = separatedSentenceElements.length;
    const targetBeginningIndex = (indexOfEarliestMention - contextLevel) < 0 ? 0 : indexOfEarliestMention - contextLevel;
    const targetEndIndex = (indexOfLatestMention + 1 + contextLevel) > maximumIndexOfSentence ? maximumIndexOfSentence : indexOfLatestMention + 1 + contextLevel;
    const arrayToUse = separatedSentenceElements.slice(targetBeginningIndex, targetEndIndex);
    arrayToUse[0] = arrayToUse[0].trim();

    console.log('arrayToUse', arrayToUse);

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
    // const allowContextIncrease = !!!(((indexOfLatestMention + (contextLevel + 1)) >= maximumIndexOfSentence  &&  (indexOfEarliestMention - (contextLevel + 1)) < 0) || (contextLevel + 1 > 10));
    const allowContextDecrease = !!(contextLevel > 1);
    const allowContextIncrease = !!((arrayToUse.length < 21) && arrayToUse.length < separatedSentenceElements.length);
    // const allowContextDecrease = !!((arrayToUse.length < 21) && arrayToUse.length < separatedSentenceElements.length);

    return (
      <div className="result">
        <Link className="overrideLinkStyling" to={`/quote?article_id=${articleData._id}&capture_groups=${captureGroup}&context_level=${contextLevel}`}>
          <div className="resultContent">
            "{ returnContent }"
          </div>

        </Link>
        <Divider />
        <div className="ui grid">
          <div className="three column row buttonRow">
            {allowContextDecrease && <div className="column contextButton" onClick={ () => this.alterContextLevel(-1) }><FaMinus />Less context</div>}
            {!allowContextDecrease && <div className="column contextButtonDisabled"><FaMinus />Less context</div>}
            <div className="column contextCounter"><Counter contextLevel={ contextLevel } separatedSentenceElements={ separatedSentenceElements } captureGroup={ captureGroup }/></div>
            {allowContextIncrease && <div className="column contextButton" onClick={ () => this.alterContextLevel(+1) }><FaPlus />More context</div>}
            {!allowContextIncrease && <div className="column contextButtonDisabled"><FaPlus />More context</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Quote
