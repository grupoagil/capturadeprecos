import { Pressable } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

interface Props {
    textAlign?: string;
    insideModalGroup?: boolean;
    isButtonCancel?: boolean;
}

export const Container = styled.View`
    flex: 1;
    background: #F5F4F4;
`;

export const Header = styled.View`
    width: 100%;
    height: 15%;
    padding: 20px;

    flex-direction: row;
    align-items: center;
`;

export const Thumbnail = styled.Image`
    width: 85px;
    height: 85px;
    border-radius: 42.5px;

    margin-left: 15px;
`;

export const HeaderTitleContainer = styled.View`
    flex: 1;
    margin-left: 15px;  
    align-items: flex-end;
`;


export const SupermarketName = styled.Text`
    font-size: 25px;
    line-height: 26px;
    font-family: 'Poppins_700Bold';
    color: #565651;
`;

export const Title = styled.Text`
    font-family: 'Poppins_600SemiBold';
    font-size: 21px;
    margin: 10px 20px;
    color: #565651;
`;

export const CardContainer = styled.FlatList`

`

export const Content = styled.FlatList`
    flex: 1;
    border-radius: 25px;
    padding: 20px;

    background-color: #FFFFFF;
    margin: 5px;
`;

export const Item = styled(Pressable)`
    width: 100%;
    height: 100px;
    margin-top: 5px;

    flex-direction: row;
    align-items: center;
`;

export const ItemThumbnail = styled.Image`
    width: 85px;
    height: 85px;
    border-radius: 8px;
`;

export const ItemContent = styled.View`
    justify-content: center;
    margin-left: 13px;
`;

export const ItemName = styled.Text`
    font-family: 'Poppins_700Bold';
    font-size: 20px;
    max-width: 85%;
`;


export const ItemBrand = styled.Text`
    font-family: 'Poppins_600SemiBold';
    font-size: 15px;
`

export const ModalContainer = styled.ScrollView`
    flex: 1;
    padding: 20px;
`;

export const ModalTitle = styled.Text`
    font-family: 'Poppins_700Bold';
    font-size: 21px;
    color: #000000;
`;

export const ModalGroup = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
`;

export const ModalInputContainer = styled.View<Props>`
    width: ${props => props.insideModalGroup ? '100%' : '100%'};
    margin-top: ${props => props.insideModalGroup ? '0' : '15px'};
`;

export const ModalLabel = styled.Text`
    font-family: 'Poppins_500Medium';
    font-size: 15px;
    color: #565651;
`;

export const ModalInput = styled.View`
    width: 100%;
    height: 50px;
    background: #EFEFEF;
    flex-direction: row;

    border-radius: 7px;

    align-items: center;
    justify-content: center;
    padding: 0 10px;
`;

export const ModalTextInput = styled.TextInput<Props>`
    font-family: 'Poppins_700Bold';
    font-size: 15px;
    flex: 1;
    color: #8E8E8E;
    margin: 0 5px;
    text-align: ${props => props.textAlign ? props.textAlign : 'left'};
`;

export const ModalButton = styled(Pressable)<Props>`
    width: ${props => props.isButtonCancel === true ? '35%' : '55%'};
    height: 50px;
    background: ${props => props.isButtonCancel === true ? '#EF3131' : '#43D87F'};
    border-radius: 5px;

    align-items: center;
    justify-content: center;
`;

export const ModalButtonText = styled.Text`
    font-family: 'Poppins_600SemiBold';
    font-size: 18px;
    color: #FFFFFF;
`;

export const FilterButton = styled(RectButton)`
    position: absolute;
    bottom: 5%;
    right: 10%;
    background: #DE5F5F;
    padding: 10px;
    border-radius: 8px;
`