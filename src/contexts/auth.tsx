import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

interface AuthState {
    token: string;
    user: object;
}

interface SignInCredentials {
    _email: string;
    password: string;
}

interface AuthContextData {
    user: object;
    signIn(credentials: SignInCredentials): Promise<boolean>;
    signOut(): void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<AuthState>({} as AuthState);

    useEffect(() => {
        async function loadStoragedData() {
            const token = await AsyncStorage.getItem('@Formosa:token');
            const user = await AsyncStorage.getItem('@Formosa:user');

            if (token && user) {
                setData({ token, user: JSON.parse(user) })
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        loadStoragedData();
    }, []);

    async function signIn({ _email, password }: SignInCredentials) {
        try {
            const login = await api.post(`/auth/login`, {
                email: _email,
                password
            })

            const { access_token } = login.data;
            
            const user = await api.get(`/auth/me`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            const { name, email } = user.data;

            await AsyncStorage.setItem('@Formosa:token', access_token);
            await AsyncStorage.setItem('@Formosa:user', JSON.stringify({
                name,
                email
            }));

            setData({
                token: access_token,
                user: {
                    name,
                    email
                }
            });

            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async function signOut() {
        await AsyncStorage.removeItem('@Formosa:token');
        await AsyncStorage.removeItem('@Formosa:user');

        setData({} as AuthState);
    }   

    return(
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
} 