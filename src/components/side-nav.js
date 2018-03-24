import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getUser } from '../store/user';

import HamburgerIcon from '../assets/svg/hamburger.svg';

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
  will-change: opacity transform;
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
  background: ${HamburgerIcon} no-repeat no-repeat;
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
  user: getUser(state)
});

const SideNav = ({user}) => (
  <Container>
    <HamburgerContainer>
      <Hamburger />
    </HamburgerContainer>
    <User>
      <Avatar src={user.avatar} />
      <Infos>
        <Username>{user.username}</Username>
        <Mail>{user.email ? user.email : ''}</Mail>
      </Infos>
    </User>
    <Menu>
      <Element><CustomLink to="/">Home</CustomLink></Element>
      <Element><CustomLink to="/about">A propos</CustomLink></Element>
      <Element><CustomLink to="/licences">Licenses musicales</CustomLink></Element>
    </Menu>
  </Container>
);

export default connect(mapStateToProps)(SideNav);
