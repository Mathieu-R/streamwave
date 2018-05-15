import { h } from 'preact';
import TopBarHamburger from '../../components/topbar-hamburger';
import styled from 'styled-components';

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const Inner = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, minmax(30px, 50px));
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  max-width: 90%;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Album = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: 12px;
  }
`;

const Licence = styled.a`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #FFF;
  font-size: 11px;
`;

const Licences = props => (
  <Container>
    <TopBarHamburger />
    <Wrapper>
      <Inner>
        <Album>Borrtex - Ability</Album><Licence href="http://creativecommons.org/licenses/by-nc/3.0/">http://creativecommons.org/licenses/by-nc/3.0/</Licence>
        <Album>Galdson - Roots</Album><Licence href="http://creativecommons.org/licenses/by-nc-nd/2.5/">http://creativecommons.org/licenses/by-nc-nd/2.5/</Licence>
        <Album>Jose Konda - Bolingo Na Nzambe</Album><Licence href="http://creativecommons.org/licenses/by-nc-sa/2.0/uk/">http://creativecommons.org/licenses/by-nc-sa/2.0/uk/</Licence>
        <Album>Mady - Laisse Entrer la fraicheur</Album><Licence href="http://creativecommons.org/licenses/by-sa/2.0/be/">http://creativecommons.org/licenses/by-sa/2.0/be/</Licence>
        <Album>Tim Praiz - Praise Your Name</Album><Licence>Creative Common</Licence>
      </Inner>
    </Wrapper>
  </Container>
);

export default Licences;
