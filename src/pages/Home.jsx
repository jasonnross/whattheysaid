import React, { Component, Fragment } from 'react'
import { Divider, Button, Input, Radio, Dropdown } from 'semantic-ui-react'
import Article from '../components/Article';
import apiRequest from '../helpers/api';
import _ from 'lodash'
import Loader from '../components/Loader';
import { inject, observer } from 'mobx-react';
import { FaArrowDown } from 'react-icons/fa';

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
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.calculateSearchSize);
    document.addEventListener('keydown', this.onEnterKey, false);
    const persons = await apiRequest({ endpoint: 'persons' });
    const { mainStore } = this.props;
    mainStore.persons = persons;
    // this.nameInput.focus();
    this.setState({
      loading: false,
    })

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
    this.setState({ loadingResult: true })
    const { searchValue, selectedPerson, showAllForms, sort } = this.state.current;
    const { persons } = this.props.mainStore;
    const i = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[i];
    if ( !searchValue || !selectedPerson ) { return false }
    const { addArticles } = this.props.mainStore;
    const articles = await apiRequest({ endpoint: 'articles/articlesByPhrase', parameters: { person_id: selectedPerson, phrase: searchValue, all_forms: (showAllForms ? 'true' : 'false'), sort } });
    addArticles(articles);
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
    const { articles } = this.props.mainStore;
    if (loadingResult) {
      return <div className="resultLoaderDiv"><Loader /></div>
    } else {
      if (last.searchValue) {
        if (articles.length > 0) {
          return <span>We found <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> said:</span>
        } else {
          return <span>We found NO EVIDENCE of <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> ever using the phrase "{ last.searchValue }".</span>
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
