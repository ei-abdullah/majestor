import React, {useState} from "react";
import {useNavigation, useRouter} from "expo-router";
import {Text, TextInput, View} from "react-native";
import {Controller, set, useForm} from "react-hook-form";
import {isAxiosError} from "axios";

import PrimaryButton from "@/src/components/ui/PrimaryButton";
import {saveRefreshToken} from "@/src/stores/secureStore";
import {useAuthStore} from "@/src/stores/authStore";
import {login} from "@/src/services/auth.api";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import OutlineButton from "@/src/components/ui/OutlineButton";

type option = {
    name: "error" | "success";
    message: string;
}

type props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setMessage: (message: option | null) => void;
}

function LoginForm({loading, setLoading, setMessage}: props) {
    const router = useRouter();
    const {control, handleSubmit, formState: {errors}} = useForm();


    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setMessage(null);

            const response = await login(data);
            const {
                data: {
                    authUserDTO: user,
                    accessToken,
                    refreshToken
                }
            } = response;

            await saveRefreshToken(refreshToken);
            useAuthStore.getState().setSession(user, accessToken);
            router.replace("/(tabs)");
        } catch (error: any) {
            if (isAxiosError(error)) {
                if (error.response?.status == 401) {
                    setMessage({
                        name: "error",
                        message: error.response.data.message || "Invalid credentials."
                    })
                } else if (error.response?.data?.message) {
                    setMessage({
                        name: "error",
                        message: error.response.data.message
                    })
                } else {
                    setMessage({
                        name: "error",
                        message: "Something went wrong. Please try again later!"
                    })
                }
            } else {
                setMessage({
                    name: "error",
                    message: "Something went wrong. Please try again later!"
                })
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <View className={"flex flex-col gap-8 w-full"}>
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-center"}>
                    <Text className={"font-semibold"}>University Email</Text>
                    {errors.email &&
                        <Text className={"text-mj-error text-xs font-semibold"}>Email is required.</Text>
                    }
                </View>
                <Controller
                    control={control}
                    name="email"
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                        <StyledTextInput
                            value={value}
                            placeholder={"you@cust.pk"}
                            icon="mail"
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-end"}>
                    <Text className={"font-semibold"}>Password</Text>
                    {errors.password &&
                        <Text className={"text-mj-error text-xs font-semibold"}>Password is required.</Text>
                    }

                </View>
                <Controller
                    control={control}
                    name="password"
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                        <StyledTextInput
                            value={value}
                            placeholder={"********"}
                            secureTextEntry={true}
                            icon="key"
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            <Text className={"text-mj-teal-400 underline underline-offset-2"}>Forgot Password?</Text>

            <PrimaryButton
                title={loading ? "Loading..." : "Login to Majestor"} className={"w-full"} disabled={loading}
                onPress={handleSubmit(onSubmit)}/>
        </View>
    );
}

export default LoginForm;