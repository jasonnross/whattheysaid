import { observable } from "mobx";

class mainStore {
  @observable title = "Coding is Love";
}

export default new mainStore();