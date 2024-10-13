import styled from 'styled-components/native';

const MypageHeader = () => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Nickname>닉네임 </Nickname>
        <Title>님의 프로필!</Title>
      </TitleWrapper>
      <NavBtn>&gt;</NavBtn>
    </Wrapper>
  );
};

export default MypageHeader;

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const Nickname = styled.Text`
  font-size: 24px;
  color: black;
  font-weight: bold;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NavBtn = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: bold;
`;