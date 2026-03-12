import * as SecureStore from "expo-secure-store"

export const saveRefreshToken = async (refreshToken: string) => {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
}

export const getRefreshToken = async () => {
    return await SecureStore.getItemAsync("refreshToken");
}

export const deleteRefreshToken = async () => {
    await SecureStore.deleteItemAsync("refreshToken");
}