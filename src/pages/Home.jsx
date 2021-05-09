import React, { Component, Fragment } from 'react'
import { Divider, Button, Input, Radio, Dropdown } from 'semantic-ui-react'
import Article from '../components/Article';
import apiRequest from '../helpers/api';
import _ from 'lodash'
import Loader from '../components/Loader';
import { inject, observer } from 'mobx-react';
import { FaArrowDown, FaRegFileExcel } from 'react-icons/fa';
import { pluralizeType } from 'helpers/strings';
import Cookies from 'universal-cookie';

@inject('mainStore')
@observer class Home extends Component {
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
  handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    const { scrolled } = this.state ?? false;
    if (!scrolled && scrollPosition > 5) {
      this.setState({
        scrolled: true,
      })
    }
    if (scrolled && scrollPosition <= 5) {
      this.setState({
        scrolled: false,
      })
    }
  }

  calculateSearchSize = () => {
    const containerWidth = getComputedStyle(document.querySelector('.container')).width;
    const searchWidth = parseInt(containerWidth) - 20;
    if (document.getElementById('search')) {
      document.getElementById('search').style.width = `${searchWidth}px`;
    }
  }
  componentDidUpdate() {
    this.calculateSearchSize();
  }
  componentDidMount = async () => {
    const { mainStore } = this.props;
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.calculateSearchSize);
    document.addEventListener('keydown', this.onEnterKey, false);

    const cookies = new Cookies();

    const personsCookie = cookies.get('persons');

    var persons;

    if (personsCookie) {
      persons = personsCookie;
      mainStore.persons = persons;
      this.setState({
        loading: false,
      })
      const personsFetchedAfter = await apiRequest({ endpoint: 'persons' });
      mainStore.persons = personsFetchedAfter;
      cookies.set('persons', personsFetchedAfter);
    } else {
      persons = await apiRequest({ endpoint: 'persons' });
      mainStore.persons = persons;
      cookies.set('persons', persons);
      this.setState({
        loading: false,
      })
    }



  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  onEnterKey = (event) => {
    if (event.keyCode===13) {
      const { current } = this.state;
      if (current.selectedPerson && current.searchValue) {
        this.search();
      }
    }
  }
  search = async () => {
    this.setState({ loadingResult: true });
    // pull input values from state;
    const { searchValue, selectedPerson, showAllForms, sort } = this.state.current;
    const { persons } = this.props.mainStore;
    const dex = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[dex];
    if ( !searchValue || !selectedPerson ) { return false }
    const { setValuesAfterSearch } = this.props.mainStore;
    const articles = await apiRequest({ endpoint: 'articles/articlesByPhrase', parameters: { person_id: selectedPerson, phrase: searchValue, all_forms: (showAllForms ? 'true' : 'false'), sort } });

    setValuesAfterSearch({ articles: articles.articles, typesSearched: articles.typesSearched, searchValue })
    this.setState({ initial: false, last: { searchValue: searchValue, selectedPerson: selectedPerson, person: person, showAllForms: showAllForms }, loadingResult: false });
  }
  renderPersonsOptions = () => {
    const { persons } = this.props.mainStore;
    if (persons) {
      return persons.map(person => {
        return {
          key: person._id, value: person._id, text: `${person.first_name} ${person.last_name}`
        }
      })
    }
  }
  renderQuotes = () => {
    const { selectedPerson, searchValue, showAllForms } = this.state.last;
    const { persons, articles } = this.props.mainStore
    if (!( selectedPerson && persons )) { return false; }
    const i = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[i];
    return articles.map((article, i) => {
      return (
        <Fragment key={ article._id+i }>
          <Article
            articleData={ article }

            personData={ person }

            searchValue={ searchValue }
            showAllForms={ showAllForms }
          />
        </Fragment>
      )
    })
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
  renderResultDescription = () => {
    const { last, loadingResult } = this.state;
    const { articles, typesSearched } = this.props.mainStore;
    function renderTypesSearched(typesSearched) {
      return typesSearched.map((typeSearched, dex) => {
        if (dex === typesSearched.length) {
          return <Fragment><span>{ `${typeSearched.count} ${pluralizeType(typeSearched._id, typeSearched.count)}` }</span></Fragment>
        } else {
          return <Fragment><span>{ `${typeSearched.count} ${pluralizeType(typeSearched._id, typeSearched.count)}` }</span><br /></Fragment>
        }
      })
    }
    if (loadingResult) {
      return <div className="resultLoaderDiv"><Loader /></div>
    } else {
      if (last.searchValue) {
        if (articles.length > 0) {
          return <span>We found <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> said:</span>
        } else {
          return (
            <div className="noResults">
              <FaRegFileExcel />
              <div>We searched</div>
              <div className="sourcesSearched">
              { renderTypesSearched(typesSearched) }
              </div>
              <div>and found NO EVIDENCE of <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> ever using the phrase "{ last.searchValue }".</div>
            </div>
          )
        }
      }
    }
  }
  toggleShowAllForms = () => {
    const { current, initial } = this.state;
    current.showAllForms = !!!current.showAllForms;
    this.setState({ current: current })
    if (!initial) {
      this.search()
    }
  }
  cycleSort = () => {
    const { current } = this.state;
    if (current.sort === 'newest') {
      current.sort = 'oldest'
    } else {
      current.sort = 'newest'
    }
    this.setState({ current: current });
    this.search();
  }
  render() {
    const { loading, loadingResult, initial, scrolled, current, last } = this.state;
    const handleFocus = (event) => event.target.select();

    function getSearchClassName(initial, scrolled) {
      if (initial) { return 'searchInitial' }
      if (scrolled) { return 'searchAfter searchAfterScrolled' }
      return 'searchAfter searchAfterUnScrolled';
    }
    if (loading) {
      return <div className="resultLoaderDiv"><Loader /></div>
    } else {
      return (
        <div>
          <div className={ getSearchClassName(initial, scrolled) } id="search">
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
              <Radio toggle onChange={ (e) => this.toggleShowAllForms(e) } checked={ current.showAllForms }/><span className="pluralities">Search all forms of { ( last.searchValue || current.searchValue ) ? '"'+( last.searchValue || current.searchValue )+'"' : "this topic" }</span>
              <span className={ initial ? 'd-none' : '' }>
              {current.sort === 'newest' && <div className="sortDropdown" onClick={ () => this.cycleSort() }>
                <FaArrowDown />
                Newest
              </div>}
              {current.sort === 'oldest' && <div className="sortDropdown" onClick={ () => this.cycleSort() }>
                <FaArrowDown />
                Oldest
              </div>
              }

              </span>

            </div>
          </div>

          <div className="moveDown">
          { !initial &&
          <Fragment>
          <Divider />
          </Fragment>
          }
            { this.renderResultDescription() }
          <br></br>
          <br></br>
            { !loadingResult && this.renderQuotes() }
          </div>
        </div>
      )
    }
  }
}

export default Home
