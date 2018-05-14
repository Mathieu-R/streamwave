import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Overlay } from './ui';

import {
  getUser
} from '../store/user';

import {
  getShowSideNav,
  hideSideNav
} from '../store/side-nav';

import closeIcon from '../assets/png/close.png';

const Container = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 90%;
  max-width: 400px;
  background: #0e1325;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  transform: translateX(-102%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1), transform 0.5s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity, transform;
  z-index: 1;
`;

const HamburgerContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  width: 100%;
  padding: 0 15px;
`;

const Hamburger = styled.button`
  background: url(${closeIcon}) no-repeat no-repeat;
  background-size: 24px 24px;
  border: none;
  width: 24px;
  height: 24px;
`;

const User = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 15px;
`;

const Avatar = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  max-width: 40px;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 15px;
`;

const Username = styled.p`
  font-weight: bold;
  font-size: 16px;
  margin: 2px 0;
`;

const Mail = styled.p`
  font-size: 12px;
  margin: 2px 0;
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
`;

const Element = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  width: 100%;
  padding-left: 15px;

  &:hover, &:focus {
    background: #3e3b3b;
  }
`;

const CustomLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #FFF;
  text-decoration: none;
`;

const mapStateToProps = state => ({
  showSideNav: getShowSideNav(state),
  user: getUser(state)
});

const mapDispatchToProps = dispatch => ({
  hideSideNav: _ => dispatch(hideSideNav())
});

class SideNav extends Component {
  shouldComponentUpdate (nextProps) {
    if (nextProps.user !== this.props.user) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps (props) {
    if (props.showSideNav) {
      this.overlay.classList.add('overlay--visible');
      this.container.classList.add('side-nav--visible');
      return;
    }

    this.overlay.classList.remove('overlay--visible');
    this.container.classList.remove('side-nav--visible');
  }

  render ({hideSideNav, user}) {
    return (
      <Overlay innerRef={overlay => this.overlay = overlay} className="overlay">
        <Container innerRef={container => this.container = container} className="side-nav">
          <HamburgerContainer>
            <Hamburger onClick={hideSideNav} aria-label="hide sidenav"/>
          </HamburgerContainer>
          <User>
            <Avatar src={user.avatar} alt="avatar" />
            <Infos>
              <Username>{user.username}</Username>
              <Mail>{user.email ? user.email : ''}</Mail>
            </Infos>
          </User>
          <Menu>
            <Element><CustomLink to="/" onClick={hideSideNav} aria-label="home">Home</CustomLink></Element>
            <Element><CustomLink to="/about" onClick={hideSideNav} aria-label="about">A propos</CustomLink></Element>
            <Element><CustomLink to="/licences" onClick={hideSideNav} aria-label="licences">Licenses musicales</CustomLink></Element>
            <Element><CustomLink to="/demo" onClick={hideSideNav} aria-label="demo streaming">Demo</CustomLink></Element>
          </Menu>
        </Container>
      </Overlay>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
