import React, { Component } from 'react'
import { Button, Dropdown, Input, Radio } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import Article from '../components/Article';
import apiRequest from '../helpers/api';
import _ from 'lodash'
import Loader from '../components/Loader';
import { inject, observer } from 'mobx-react';
import { FaArrowDown, FaRegFileExcel } from 'react-icons/fa';
import { RiTwitterFill, RiBarChartHorizontalLine, RiForbid2Line } from "react-icons/ri";
import { pluralizeType } from 'helpers/strings';
// import getURLParams from 'helpers/urlParams';


@inject('mainStore')
@observer class SearchBar extends Component {
  state = {
    initial: true,
    loading: true,
    loadingResult: false,
    current: {
      searchValue: null,
      selectedPerson: null,
      person: {},
      showAllForms: true,
      sort: 'newest',
      source: 'everything',
    },
    last: {
      searchValue: null,
      selectedPerson: null,
      person: {},
      showAllForms: true,
    },
    persons: [],
    articles: [],
  }
  async componentDidMount() {
    const { mainStore } = this.props;
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.calculateSearchSize);
    document.addEventListener('keydown', this.onEnterKey, false);

    const cookies = new Cookies();
    const cookiesObj = cookies.getAll();

    // this.setSearchPreferencesByCookiesOrBust();

    var persons;

    if (cookiesObj.persons) {
      this.setState({ loading: false, })
      // console.log('persons cookie was found to be set as: ', cookiesObj.persons);
      persons = cookiesObj.persons;
      mainStore.persons = persons;
      const personsFetchedAfter = await apiRequest({ endpoint: 'persons' });
      mainStore.persons = personsFetchedAfter;
      cookies.set('persons', personsFetchedAfter);
      // console.log('fetched new persons to check for updated list: ', personsFetchedAfter);
    } else {
      // console.log('existing persons cookie not found, fetching a brand new one')
      persons = await apiRequest({ endpoint: 'persons' });
      // console.log('brand new persons found: ', persons);
      mainStore.persons = persons;
      cookies.set('persons', persons);
      this.setState({ loading: false, })
    }
  }
  // setSearchPreferencesByCookiesOrBust() {
  //   const cookies = new Cookies();
  //   const cookiesObj = cookies.getAll();

  //   const { current } = this.state;
  //   var currentObjectToModify = current;
  //   const keys = Object.keys(current);

  //   for (let dex = 0; dex < keys.length; dex++) {
  //     if (!(keys[dex] in cookiesObj) || ['persons', 'searchValue', 'selectedPerson'].includes(keys[dex])) {
  //       continue;
  //     }
  //     currentObjectToModify[keys[dex]] = cookiesObj[keys[dex]];
  //   }
  //   this.setState({ current: currentObjectToModify })
  // }

  calculateSearchSize = () => {
    const containerWidth = getComputedStyle(document.querySelector('.container')).width;
    const searchWidth = parseInt(containerWidth) - 40;
    if (document.getElementById('search')) {
      document.getElementById('search').style.width = `${searchWidth}px`;
    }
  }
  onEnterKey = (event) => {
    if (event.keyCode===13) {
      const { current } = this.state;
      if (current.selectedPerson && current.searchValue) {
        this.search();
      }
    }
  }
  toggleShowAllForms = () => {
    const { current, initial } = this.state;
    current.showAllForms = !!!JSON.parse(current.showAllForms);
    const cookies = new Cookies();
    cookies.set('showAllForms', JSON.parse(current.showAllForms));
    this.setState({ current: current })
    if (!initial) {
      this.search()
    }
  }
  onPersonChange = (event, {value}) => {
    const { persons } = this.props.mainStore
    const i = _.findIndex(persons, function(o) { return o._id === value; });
    const person = persons[i];
    const { current } = this.state;
    current.selectedPerson = value;
    current.person = person;
    this.setState({ current: current })
  }
  onSearchChange = (e) => {
    const { current } = this.state;
    current.searchValue = e.target.value;
    this.setState({ current: current });
  }
  search = async () => {
    this.setState({ loadingResult: true });
    // pull input values from state;
    const { searchValue, selectedPerson, showAllForms, sort, source } = this.state.current;
    const { persons } = this.props.mainStore;
    const dex = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[dex];
    if ( !searchValue || !selectedPerson ) { return false }
    const { setValuesAfterSearch } = this.props.mainStore;
    const articles = await apiRequest({ endpoint: 'articles/articlesByPhrase', parameters: { person_id: selectedPerson, phrase: searchValue, all_forms: (showAllForms ? 'true' : 'false'), sort, source } });
    console.log(articles);
    setValuesAfterSearch({ articles: articles.articles, typesSearched: articles.typesSearched, searchValue })
    console.log(person)
    document.title = `What ${person.first_name} ${person.last_name} said`;
    this.setState({ initial: false, last: { searchValue: searchValue, selectedPerson: selectedPerson, person: person, showAllForms: showAllForms }, loadingResult: false });
  }
  handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    const { scrolled } = this.state ?? false;
    if (!scrolled && scrollPosition > 4) {
      this.setState({
        scrolled: true,
      })
    }
    if (scrolled && scrollPosition <= 4) {
      this.setState({
        scrolled: false,
      })
    }
  }
  renderPersonsOptions = () => {
    const { persons } = this.props.mainStore;
    if (persons) {
      return persons.map(person => {
        return {
          key: person.id, value: person.id, text: `${person.first_name} ${person.last_name}`
        }
      })
    }
  }

  render() {
    const handleFocus = (event) => event.target.select();
    const { scrolled, current, last } = this.state;
    function getSearchClassName(scrolled) {
      if (scrolled) { return 'searchAfter searchAfterScrolled' }
      return 'searchAfter searchAfterUnScrolled';
    }
    return (
      <div className={ getSearchClassName(scrolled) } id="search">
        <div className="searchBar">
          What did
          &nbsp;&nbsp;
          <Dropdown
            className="personsSelect"
            search
            selection
            placeholder='this person'
            onChange={this.onPersonChange}
            options={ this.renderPersonsOptions()}
            openOnFocus
            searchInput={{ autoFocus: true }}
          />
          &nbsp;&nbsp;
          say about
          &nbsp;&nbsp;
          <Input className="topicInput" transparent placeholder='this topic' onChange={ (e) => this.onSearchChange(e) }  onFocus={handleFocus} />
          { (!current.selectedPerson || !current.searchValue || ( current.searchValue === last.searchValue && current.selectedPerson === last.selectedPerson && current.showAllForms === last.showAllForms )) ? <Button primary disabled>?</Button> : <Button onClick={ this.search } primary>?</Button> }
        </div>

        <div className="navigationButtons">
          <Radio toggle onChange={ (e) => this.toggleShowAllForms(e) } checked={ JSON.parse(current.showAllForms) }/><span className="pluralities">Search all forms of { ( last.searchValue || current.searchValue ) ? '"'+( last.searchValue || current.searchValue )+'"' : "this topic" }</span>
          <span>

          {current.sort === 'newest' && <div className="searchModifierButton sortSelector" onClick={ () => this.cycleSort() }>
            <FaArrowDown />
            Newest
          </div>}
          {current.sort === 'oldest' && <div className="searchModifierButton sortSelector" onClick={ () => this.cycleSort() }>
            <FaArrowDown />
            Oldest
          </div>
          }

          {current.source === 'everything' &&
            <div className="searchModifierButton sourceSelector" onClick={ () => this.cycleSources() }>
              <RiBarChartHorizontalLine />
              Everything
            </div>
          }
          {current.source === 'tweets' &&
            <div className="searchModifierButton sourceSelector" onClick={ () => this.cycleSources() }>
              <RiTwitterFill />
              Tweets
            </div>
          }
          {current.source === 'no_tweets' &&
            <div className="searchModifierButton sourceSelector" onClick={ () => this.cycleSources() }>
              <RiForbid2Line />
              No Tweets
            </div>
          }
          </span>

        </div>
      </div>

    )
  }
}

export default SearchBar
