import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import crown from '../../assets/images/crown.png';
import arrow from '../../assets/images/Arrow.png';

const MypageHeader = ({nickname, premium}) => {
  const navigation = useNavigation();
  return (
    <Wrapper onPress={() => navigation.navigate('SettingScreen')}>
      <TitleWrapper>
        <NicknameWrapper>
          {premium && <Crown source={crown} />}
          <Nickname>{nickname} </Nickname>
        </NicknameWrapper>
        <Title>님의 프로필!</Title>
      </TitleWrapper>
      <NavBtn source={arrow} />
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

const NicknameWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const Crown = styled.Image`
  width: 18px;
  height: 11px;
  margin-left: -18px;
  margin-top: -24px;
`;

const Nickname = styled.Text`
  font-size: 24px;
  margin-left: -10px;
  margin-bottom: 2px;
  color: black;
  font-weight: bold;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NavBtn = styled.Image`
  width: 12px;
  height: 24px;
`;
