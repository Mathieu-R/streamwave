import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import debounce from 'debounce';
import styled from 'styled-components';
import Constants from '../constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const SearchBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 5px;
`;

const SearchBar = styled.input`
  outline: none;
  height: 40px;
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background: #2D3535;
  color: #FFF;
  font-size: 16px;
  transform: scale(${props => props.open ? 1 : 0.97});
  transition: transform .2s ease-out;
  will-change: transform;
`;

class Search extends Component {
  constructor () {
    super();

    this.onOpenSearchBar = this.onOpenSearchBar.bind(this);
    this.onCloseSearchBar = this.onCloseSearchBar.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      searchBarOpen: false
    }
  }

  onOpenSearchBar () {

    this.setState({
      searchBarOpen: true
    });
  }

  onCloseSearchBar () {
    this.setState({
      searchBarOpen: false
    });
  }

  onInputChange (evt) {
    const term = evt.target.value;
    if (term === '') return;
    // avoid doing too much api calls
    const search = debounce(_ => this.search(term), 150);
    search();
  }

  search (term) {
    fetch(`${Constants.API_URL}/search/${term}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    }).then(response => response.json())
      .then(response => {
        console.log(response);
      });
  }

  render ({}, {searchBarOpen}) {
    return (
      <Container>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Rechercher"
            onInput={this.onInputChange}
            onClick={this.onOpenSearchBar}
            onBlur={this.onCloseSearchBar}
            open={searchBarOpen}
          />
        </SearchBarContainer>
      </Container>
    );
  }
}

export default pure(Search);
