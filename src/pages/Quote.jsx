import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import apiRequest from 'helpers/api';
import _ from 'lodash';

@inject('mainStore')
@observer class Quote extends Component {
  async componentDidMount() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);
    const { articles: articlesFromMainStore } = this?.props?.mainStore || false;
    console.log(articlesFromMainStore);
    if (articlesFromMainStore?.articles.length > 0) {
      const indexOfArticle = _.findIndex(articlesFromMainStore, function(o) { return o._id === params?.article_id; });
      const relevantArticle = articlesFromMainStore[indexOfArticle];
      console.log(relevantArticle);
    } else {
      const relevantArticle = await apiRequest({ endpoint: 'articles/articleById', parameters: { article_id: params?.article_id } });
      console.log(relevantArticle);
    }
  }

  renderQuote() {
    return <div>yee</div>
  }

  render() {
    return (
      this.renderQuote()
    )
  }
}

export default Quote
