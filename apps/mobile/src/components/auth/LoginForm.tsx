import React from "react";
import {Text, TextInput, View} from "react-native";
import {Controller, useForm} from "react-hook-form";

import {PrimaryButton} from "@/src/components/PrimaryButton";
import {saveRefreshToken} from "@/src/stores/secureStore";
import {useAuthStore} from "@/src/stores/authStore";
import {login} from "@/src/services/auth.api";
import StyledTextInput from "@/src/components/StyledTextInput";

export default function LoginForm() {
    const {control, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data: any) => {
        try {
            const LoginResponse = await login(data);
            const {
                data: {
                    authUserDTO: user,
                    accessToken,
                    refreshToken
                }
            } = LoginResponse;
            await saveRefreshToken(refreshToken);
            useAuthStore.getState().setSession(user, accessToken);
        } catch (error: any) {
            alert(error.message);
        }
    }


    return (
        <View className={"flex flex-col gap-6"}>
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-center"}>
                    <Text>Student Email</Text>
                    <Text className={"text-mj-error"}>{errors.email && <Text>This field is required.</Text>}</Text>
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
                <View className={"flex flex-row justify-between items-center"}>
                    <Text>Password</Text>
                    <Text className={"text-mj-error"}>{errors.password && <Text>This field is required.</Text>}</Text>
                </View>
                <Controller
                    control={control}
                    name="password"
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

            <Text className={"text-mj-blue-600 underline underline-offset-2"}>Forgot Password?</Text>

            <PrimaryButton title="Login to Majestor" onPress={handleSubmit(onSubmit)}/>
        </View>
    );
}