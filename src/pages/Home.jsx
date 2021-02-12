import React, { Component, Fragment } from 'react'
import { Divider, Button, Input, Radio, Dropdown } from 'semantic-ui-react'
import Article from '../components/Article';
import apiRequest from '../helpers/api';
import _ from 'lodash'
import Loader from '../components/Loader';
import { inject, observer } from 'mobx-react';

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
    document.getElementById('search').style.width = `${searchWidth}px`;
  }
  componentDidUpdate() {
    this.calculateSearchSize();
  }
  componentDidMount = async () => {
    setInterval(() => {
      const { mainStore } = this.props;
      console.log(mainStore)
    }, 8000);
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.calculateSearchSize);
    document.addEventListener('keydown', this.onEnterKey, false);
    const persons = await apiRequest({ endpoint: 'persons' });

    const { mainStore } = this.props;
    mainStore.persons = persons;

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
    const { searchValue, selectedPerson, showAllForms } = this.state.current;
    const { persons } = this.props.mainStore;
    const i = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[i];
    if ( !searchValue || !selectedPerson ) { return false }
    const { addArticles } = this.props.mainStore;
    const articles = await apiRequest({ endpoint: 'articles/articlesByPhrase', parameters: { person_id: selectedPerson, phrase: searchValue, all_forms: (showAllForms ? 'true' : 'false') } });
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
        <Fragment key={ article._id+i }><Article articleId={ article._id } name={ `${person.first_name} ${person.last_name}` } date={ article.date } method={ article.type } searchValue={ searchValue } showAllForms={ showAllForms } content={ article.content } /></Fragment>
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
    const { current } = this.state;
    current.showAllForms = !!!current.showAllForms;
    this.setState({ current: current })
    this.search()
  }
  render() {
    const { loading, loadingResult, initial, scrolled, current, last } = this.state;
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
                  inline
                  placeholder='this person'
                  onChange={this.onPersonChange}
                  options={ this.renderPersonsOptions()}
                />
                &nbsp;&nbsp;
                say about
                &nbsp;&nbsp;
                <Input className="topicInput" transparent placeholder='this topic' onChange={ (e) => this.onSearchChange(e) }/>
                { (!current.selectedPerson || !current.searchValue || ( current.searchValue === last.searchValue && current.selectedPerson === last.selectedPerson && current.showAllForms === last.showAllForms )) ? <Button primary disabled>?</Button> : <Button onClick={ this.search } primary>?</Button> }
              </div>

              <div className="navigationButtons">
                <Radio toggle onChange={ (e) => this.toggleShowAllForms(e) } checked={ current.showAllForms }/><span className="pluralities">Explore all pluralities and forms of { ( last.searchValue || current.searchValue ) ? '"'+( last.searchValue || current.searchValue )+'"' : "this topic" }</span>
                <Dropdown
                  className="sortDropdown"
                  inline
                  placeholder="Newest first"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item text='Newest first' />
                    <Dropdown.Item text='Most relevant' />
                  </Dropdown.Menu>
                </Dropdown>
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
