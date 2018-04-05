import { h, Component } from 'preact';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Overlay } from './ui';

import backIcon from '../assets/svg/arrow.svg';

import {
  createPlaylist
} from '../store/playlists';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  margin: 10px;
  border-radius: 5px;
  background: #000;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity .3s cubic-bezier(0, 0, 0.3, 1);
`;

const CreateContainer = styled.div`
  position: relative;
  height: 40px;
`;

const CreateButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  color: #000;
  flex-grow: 1;
  margin: 10px;
`;

const CreateInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #FFF;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.1s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity;
`;

const Back = styled.button`
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  background: url(${backIcon}) no-repeat no-repeat;
  background-size: 24px 24px;
  width: 24px;
  height: 24px;
`;

const mapDispatchToProps = dispatch => ({
  createPlaylist: payload => dispatch(createPlaylist(payload))
});

class PlaylistModal extends Component {
  constructor () {
    super();

    this.showPlaylistInput = this.showPlaylistInput.bind(this);
    this.removePlaylistInput = this.removePlaylistInput.bind(this);
    this.showPlaylistInput = false;
  }

  componentDidMount () {
    fetch('/playlists', {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });
  }

  showPlaylistInput () {
    this.showPlaylistInput = true;
  }

  removePlaylistInput () {
    this.showPlaylistInput = true;
  }

  render ({show}) {
    <Overlay show={show}>
      <Container show={show}>
        <CreateContainer>
          <CreateButton onClick={this.showPlaylistInput}>Créer une nouvelle playlist</CreateButton>
          <CreateInput show={this.showPlaylistInput} type="text">
            <Back />
          </CreateInput>
        </CreateContainer>
      </Container>
    </Overlay>
  }
}

export default connect(null, mapDispatchToProps)(PlaylistModal);
