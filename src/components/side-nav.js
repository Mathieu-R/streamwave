import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getUser
} from '../store/user';

import {
  getShowSideNav,
  hideSideNav
} from '../store/side-nav';

import closeIcon from '../assets/png/close.png';

console.log(closeIcon);

const Container = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 90%;
  max-width: 400px;
  background: #0e1325;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  transform: translateX(${props => props.show ? 0 : '-102%'});
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1), transform 0.5s cubic-bezier(0, 0, 0.3, 1);
  will-change: opacity transform;
  z-index: 1;
`;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  z-index: 10000;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${props => props.show ? 1 : 0};
    transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1);
    will-change: opacity
  }
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
  background: ${closeIcon} no-repeat no-repeat;
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

const SideNav = ({showSideNav, hideSideNav, user}) => (
  <Overlay show={showSideNav}>
    <Container show={showSideNav}>
      <HamburgerContainer>
        <Hamburger onClick={hideSideNav} />
      </HamburgerContainer>
      <User>
        <Avatar src={user.avatar} />
        <Infos>
          <Username>{user.username}</Username>
          <Mail>{user.email ? user.email : ''}</Mail>
        </Infos>
      </User>
      <Menu>
        <Element><CustomLink to="/" onClick={hideSideNav}>Home</CustomLink></Element>
        <Element><CustomLink to="/about" onClick={hideSideNav}>A propos</CustomLink></Element>
        <Element><CustomLink to="/licences" onClick={hideSideNav}>Licenses musicales</CustomLink></Element>
      </Menu>
    </Container>
  </Overlay>
);

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
