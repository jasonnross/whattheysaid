import { action, observable } from "mobx";

class mainStore {
  @observable articles = null;
  @action addArticles = (articles) => {
    this.articles = articles;
  }
}

export default new mainStore();