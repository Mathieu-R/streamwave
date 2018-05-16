import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import debounce from 'debounce';
import styled from 'styled-components';
import { Loader } from '../components/loading';
import { fade } from '../components/ui';
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
  transform: scale(0.97);
  transition: transform .2s ease-out;
  will-change: transform;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 22px;
`;

const SearchResults = styled.section`
  width: 100%;
  height: 100%;
  margin-top: 50px;
  margin-bottom: 100px;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #FFF;
`;

const Artist = styled.div`

`;

const Title = styled.div``;

const LineResults = styled(Link)`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-auto-flow: column;
  height: 50px;
  font-weight: 400;
  grid-gap: 20px;
  padding: 0 20px;
  animation: ${fade} linear .3s;
`;

const Artwork = styled.div``;

class Search extends Component {
  constructor () {
    super();

    this.onOpenSearchBar = this.onOpenSearchBar.bind(this);
    this.onCloseSearchBar = this.onCloseSearchBar.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      loading: false,
      results: []
    };
  }

  onOpenSearchBar () {
    this.searchBar.style.transform = `scale(1)`;
  }

  onCloseSearchBar () {
    this.searchBar.style.transform = 'scale(0.97)';
  }

  onInputChange (evt) {
    const term = evt.target.value;
    if (term === '') return;
    // avoid doing too much api calls
    const search = debounce(_ => this.search(term), 150);
    search();
  }

  search (term) {
    // show a spinner if loading is too long
    const timeout = setTimeout(_ => this.setState({loading: true}), 500);

    fetch(`${Constants.API_URL}/search/${term}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    }).then(response => response.json())
      .then(({results}) => {
        if (results.length === 0) {
          return this.setState({noResults: true});
        }
        return this.setState({results});
      })
      .then(_ => {
        clearTimeout(timeout);
        if (this.state.loading) {
          this.setState({
            loading: false
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderResults (results) {
    return (
      results.map(result => (
        <LineResults key={result._id} to={`/album/${result._id}`}>
          <Cover src={`${Constants.CDN_URL}/${result.coverURL}`}></Cover>
          <Infos>
            <Artist>{result.artist}</Artist>
            <Title>{result.title}</Title>
          </Infos>
        </LineResults>
      ))
    );
  }

  render ({}, {loading, noResults, results}) {
    console.log(loading, results);
    return (
      <Container>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Rechercher"
            innerRef={searchBar => this.searchBar = searchBar}
            onInput={this.onInputChange}
            onClick={this.onOpenSearchBar}
            onBlur={this.onCloseSearchBar}
          />
        </SearchBarContainer>
        <SearchResults>
          {
            loading ?
            <Center><Loader color='#FFF' /></Center>
            :
            noResults && results.length === 0 ?
            <Center><div>Aucun résultats</div></Center>
            :
            this.renderResults(results)
          }
        </SearchResults>
      </Container>
    );
  }
}

export default Search;
