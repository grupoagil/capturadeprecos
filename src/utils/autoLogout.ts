import AsyncStorage from "@react-native-community/async-storage";

export async function deleteUser() {
  await AsyncStorage.removeItem('@Formosa:token');
  await AsyncStorage.removeItem('@Formosa:user');

  return
}