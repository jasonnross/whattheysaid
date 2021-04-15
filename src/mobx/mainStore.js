import { action, observable } from "mobx";

class mainStore {
  @observable articles = null;
  @action addArticles = (articles, typesSearched) => {
    this.articles = articles;
    this.typesSearched = typesSearched;
  }
}

export default new mainStore();