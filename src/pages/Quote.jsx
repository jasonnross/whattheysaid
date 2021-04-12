import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Fragment } from 'react';
import apiRequest from '../helpers/api';
import getURLParams from '../helpers/urlParams';

@inject('mainStore')
@observer class Quote extends Component {
  state = {
    loading: true,
  }

  componentDidMount = async () => {
    const { mainStore } = this.props;
    const urlParams = getURLParams();
    const { article_id, capture_groups, context_level } = urlParams;
    let captureGroups = capture_groups.split(',');
    captureGroups = captureGroups.map((element) => {
      return parseInt(element)
    })

    if(mainStore.articles) { // if articles are already set in global state
      let matchingArticles = mainStore.articles.filter(o => o._id.includes(article_id));
      if (matchingArticles.length > 0) {
        let article = matchingArticles[0];
        this.setState({ article, captureGroups, context_level: parseInt(context_level), loading: false })
      }
    } else { // articles not found in global state, hit API to get specific article
      const articleResult = await apiRequest({ endpoint: 'articles/articleById', parameters: { article_id } });
      const article = articleResult[0];
      this.setState({ article, captureGroups, context_level: parseInt(context_level), loading: false })
    }
  }

  renderQuote = () => {
    const { article, captureGroups, context_level } = this.state;
    const { mainStore } = this.props;
    var separatedSentenceElements = article.content.split(/(?<=[.!?])/);

    // console.log('sentence elements:', separatedSentenceElements)
    // console.log('capture groups', captureGroups);

    function getExtraContextFromOriginalQuote({ separatedSentenceElements, captureGroups, context_level }) {
      // first part
      let firstPart = () => {
        let startIndexOfFirstPart = () => {
          if ((captureGroups[0] - context_level - 1) <= 0) { return 0 }
          return captureGroups[0] - context_level - 1;
        }
        let endIndexOfFirstPart = () => {
          if ((captureGroups[0] - context_level) <= 0) { return 0 }
          return captureGroups[0] - context_level;
        }
        return separatedSentenceElements.slice(startIndexOfFirstPart(), endIndexOfFirstPart());
      }
      let middlePart = () => {
        let startIndexOfMiddlePart = () => {
          if (captureGroups[0] - context_level <= 0) { return 0 }
          return captureGroups[0] - context_level;
        }
        let endIndexOfMiddlePart = () => {
          if (captureGroups[captureGroups.length-1] + context_level >= separatedSentenceElements.length-1) { return separatedSentenceElements.length-1 }
          return captureGroups[captureGroups.length-1] + context_level + 1;
        }
        return separatedSentenceElements.slice(startIndexOfMiddlePart(), endIndexOfMiddlePart());
      }
      let lastPart = () => {
        let startIndexOfLastPart = () => {
          if (captureGroups[captureGroups.length-1] + context_level >= separatedSentenceElements.length-1) { return separatedSentenceElements.length-1 }
          return captureGroups[captureGroups.length-1] + context_level + 1;
        }
        let endIndexOfLastPart = () => {
          if (captureGroups[captureGroups.length-1] + context_level + 1 >= separatedSentenceElements.length) { console.log('e'); return separatedSentenceElements.length-1 }
          return captureGroups[captureGroups.length-1] + 2 + context_level;
        }
        return separatedSentenceElements.slice(startIndexOfLastPart(), endIndexOfLastPart());
      }

      return { firstPart: firstPart(), middlePart: middlePart(), lastPart: lastPart()  }
    }

    const extraContext = getExtraContextFromOriginalQuote({ separatedSentenceElements, captureGroups, context_level })

    const person = () => {
      if (!mainStore.persons) { return false }
      const personsFiltered = mainStore.persons.filter(o => o._id.includes(article.person_id))
      if (personsFiltered.length !== 1) { return false }
      return personsFiltered[0];
    }

    const thisPerson = person();

    return (
      <div className="quoteWithinArticleContainer">
        <h4>On December 3rd, 2020 { thisPerson ? `${thisPerson.first_name} ${thisPerson.last_name}` : 'that guy' } said: </h4>
        <div className="quoteWithinArticle">
          <p>
            { extraContext.firstPart }
            <span className="quoteWithinArticleHighlight">{ extraContext.middlePart }</span>
            { extraContext.lastPart }
          </p>
        </div>
      </div>
    )

  }


  render() {
    if (this.state.loading) { return <div>loading</div> }
    return (
      <Fragment>
        { this.renderQuote() }
      </Fragment>
    )
  }
}

export default Quote
