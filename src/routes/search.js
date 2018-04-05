import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import debounce from 'debounce';
import styled from 'styled-components';

const Container = styled.div``;

class Search extends Component {
  constructor () {
    super();
    this.search = this.search.bind(this);
  }

  search () {
  }

  render () {
    return (
      <Container>

      </Container>
    );
  }
}
