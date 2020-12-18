import styled from 'styled-components/native';

export const Container = styled.View`
  height: 5px;
  width: 70%;
  background-color: #5c5c5c;
  border-radius: 50px;
`;

export const Filler = styled.View`
  height: 100%;
  width: ${(props) => props.completed}%;
  background-color: #DE5F5F;
  border-radius: 50px;
  text-align: right;
`;
