import React from 'react';
import styled from 'styled-components';

function Routine() {
  return (
    <Container>
      <MyPageText>Routine</MyPageText>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #e0f7fa;
`;

const MyPageText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #00796b;
`;

export default Routine;
