import React, { Component, Fragment } from 'react'
import { Divider, Button, Input, Radio, Dropdown } from 'semantic-ui-react'
import Article from '../components/Article';
import apiRequest from '../helpers/api';
import _ from 'lodash'
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export class Home extends Component {
  state = {
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
  componentDidMount = async () => {
    const persons = await apiRequest({ endpoint: 'persons' });
    document.addEventListener('keydown', this.onEnterKey, false);
    this.setState({
      loading: false,
      persons: persons,
    })
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
    const { persons } = this.state;
    const i = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[i];
    if ( !searchValue || !selectedPerson ) { return false }
    const articles = await apiRequest({ endpoint: 'articles/articlesByPhrase', parameters: { person_id: selectedPerson, phrase: searchValue, all_forms: (showAllForms ? 'true' : 'false') } });
    this.setState({ last: { searchValue: searchValue, selectedPerson: selectedPerson, person: person, showAllForms: showAllForms }, articles: articles, loadingResult: false });
  }
  renderPersonsOptions = () => {
    const { persons } = this.state;
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
    const { articles, persons } = this.state;
    if (!( selectedPerson && persons )) { return false; }
    const i = _.findIndex(persons, function(o) { return o._id === selectedPerson; });
    const person = persons[i];
    return articles.map((article, i) => {
      return (
        <Fragment key={ article._id+i }><Article name={ `${person.first_name} ${person.last_name}`} date={ article.date } method={ article.type } searchValue={ searchValue } showAllForms={ showAllForms } content={ article.content } /></Fragment>
      )
    })
  }
  onPersonChange = (event, {value}) => {
    const { persons } = this.state;
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
    const { last, articles, loadingResult } = this.state;
    if (loadingResult) {
      return <div className="resultLoaderDiv"><Loader /></div>
    } else {
      if (last.searchValue) {
        if (articles.length > 0) {
          return <span>We found <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> said:</span>
        } else {
          return <span>We found NO EVIDENCE of <b>{ `${last.person.first_name} ${last.person.last_name}` }</b> ever using the phrase "{ last.searchValue }".</span>
        }
      } else {
        return <Footer />
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
    const { loading } = this.state;
    const { current, last } = this.state;

    if (loading) {
      return <div className="resultLoaderDiv"><Loader /></div>
    } else {
      return (
        <div>
          <div className="search">
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
          <Divider />
            { this.renderResultDescription() }
          <br></br>
          <br></br>
            { this.renderQuotes() }
        </div>
      )
    }


  }
}

export default Home
