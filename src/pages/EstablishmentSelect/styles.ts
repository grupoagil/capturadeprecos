import { Pressable } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width:  100%;
    height: 90px;
    background: #DE5F5F;
    padding: 0 20px 10px 20px;
    
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

`;

export const HeaderText = styled.Text`
    font-family: 'Poppins-SemiBold';
    font-size: 21px;
    color: #FFFFFF
`;

export const Content = styled.View`
    flex: 1;
    padding: 20px 0;
    background-color: #FFFFFF
`;

export const Title = styled.Text`
    font-family: 'Poppins-SemiBold';
    font-size: 21px;
    color: #565651;
    margin-left: 20px;
    margin-bottom: 10px;
`;

export const List = styled.FlatList`
    flex: 1;
`;

export const Card = styled(Pressable)`
    width: 50%;
    height: 200px;
    background-color: #FFFFFF;
    border-radius: 15px;
    margin: 5px 0;
    elevation: 2;
`;

export const Thumbnail = styled.Image`
    width: 100%;
    height: 140px;
`;


export const CardTextContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;

export const CardText = styled.Text`
    font-family: 'Poppins-Medium';
    font-size: 14px;
    text-align: center;
`;
