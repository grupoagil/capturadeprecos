import { Pressable } from 'react-native';
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

    margin-left: 15px
`;

export const HeaderTitleContainer = styled.View`
    flex: 1;
    margin-left: 15px;  
    justify-content: center;
`;

export const Supermarket = styled.Text`
    font-size: 18px;
    font-family: 'Poppins-SemiBold';
    color: #565651;
`;

export const SupermarketName = styled.Text`
    font-size: 36px;
    line-height: 40px;
    font-family: 'Poppins-Bold';
    color: #565651;
`;

export const Title = styled.Text`
    font-family: 'Poppins-SemiBold';
    font-size: 21px;
    margin: 10px 20px;
    color: #565651;
`;

export const Content = styled.FlatList`
    flex: 1;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    padding: 20px;

    background-color: #FFFFFF
`;

export const Item = styled.View`
    width: 100%;
    height: 100px;
    margin-top: 5px;

    flex-direction: row;
    align-items: center
`;

export const ItemThumbnail = styled.Image`
    width: 85px;
    height: 85px;
    border-radius: 8px;
`;

export const ItemContent = styled.View`
    justify-content: center;
    margin-left: 13px
`;

export const ItemName = styled.Text`
    font-family: 'Poppins-Bold';
    font-size: 20px;
`;


export const ItemBrand = styled.Text`
    font-family: 'Poppins-Light';
    font-size: 15px;
`

export const Fab = styled(Pressable)`
    width: 70px;
    height: 70px;
    border-radius: 35px;
    background-color: #DE5F5F;

    position: absolute;
    right: 20px;
    bottom: 20px;

    align-items: center;
    justify-content: center;
`;

export const ModalContainer = styled.View`
    flex: 1;
    padding: 20px;
`;

export const ModalTitle = styled.Text`
    font-family: 'Poppins-Bold';
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
    width: ${props => props.insideModalGroup ? '45%' : '100%'};
    margin-top: ${props => props.insideModalGroup ? '0' : '15px'};
`;

export const ModalLabel = styled.Text`
    font-family: 'Poppins-Medium';
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
    font-family: 'Poppins-Bold';
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
    font-family: 'Poppins-SemiBold';
    font-size: 18px;
    color: #FFFFFF
`;