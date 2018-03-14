import styled from 'styled-components';

export const TopBarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
`;

export const TopBarButton = styled.img`
  position: absolute;
  top: 50%;
  left: 15px;
  height: 30px;
  width: 30px;
  transform: translateY(-50%);
`;

export const TopBarTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
