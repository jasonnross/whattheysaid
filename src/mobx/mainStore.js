import { action, observable } from "mobx";

class mainStore {
  @observable articles = null;
  @observable typesSearched = null;
  @observable searchValue = null;
  @action setValuesAfterSearch = ({ articles, typesSearched, searchValue }) => {
    this.articles = articles;
    this.typesSearched = typesSearched;
    this.searchValue = searchValue;
  }

}

export default new mainStore();