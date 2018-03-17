import styled from 'styled-components';

const Input = styled.input`
  position: absolute;
  opacity: 0;

  &:checked~${Label}::before {
    opacity: 1;
  }

  &:checked~${Label}::after {
    transform: translate(0, -50%);
  }
`;

const Label = styled.label`
  position: relative;
  padding: 5px 75px 5px 5px;
  font-size: 16px;
  font-weight: bold;

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 50px;
    height: 20px;
    border-radius: 10px;
    background: #1870D7;
    transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
    top: 50%;
    right: 5px;
    opacity: 0.5;
    transform: translateY(-50%);
    will-change: opacity;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    height: 24px;
    width: 24px;
    top: 50%;
    right: 5px;
    transform: translate(-25px, -50%);
    border-radius: 50%;
    background: #FFF;
    transition: transform .3s cubic-bezier(0, 0, 0.3, 1);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    will-change: transform;
  }
`;

const Switch = ({label}) => (
  <div>
    <Input type="checkbox" id={label} />
    {/* Little Hack => altough preact support "for" attribute, styled-components only accept "htmlFor" */}
    <Label htmlFor={label}>{label}</Label>
  </div>
);

export default Switch;

