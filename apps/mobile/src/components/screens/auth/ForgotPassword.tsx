import React, {useState} from "react";
import {View, Text, Pressable} from "react-native";
import {useRouter} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import {isAxiosError} from "axios";
import {Feather} from "@expo/vector-icons";

import StyledTextInput from "@/src/components/ui/StyledTextInput";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import ErrorText from "@/src/components/ui/ErrorText";
import {validateUniEmail} from "@/src/utils/validation";
import {forgotPasswordApi} from "@/src/services/auth.api";

function ForgotPassword() {
    const router = useRouter();
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            await forgotPasswordApi(data.email);
            setSent(true);
        } catch (err: any) {
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-mj-bg px-6 pt-16">
            <Pressable
                onPress={() => router.back()}
                className="mb-8 self-start p-1"
            >
                <Feather name="arrow-left" size={22} color="#333"/>
            </Pressable>

            <Text className="font-sans-bold text-2xl text-gray-800 mb-2">Forgot Password?</Text>
            <Text className="font-sans text-gray-500 mb-10">
                Enter your university email and we'll send you a link to reset your password.
            </Text>

            {sent ? (
                <View className="items-center gap-4 mt-4">
                    <Feather name="mail" size={48} color="#3A6FF8"/>
                    <Text className="font-sans-bold text-lg text-gray-800 text-center">Check your inbox</Text>
                    <Text className="font-sans text-gray-500 text-center">
                        If this email is registered, you'll receive a reset link shortly.
                    </Text>
                    <Pressable
                        onPress={() => router.back()} className="mt-4"
                    >
                        <Text className="font-sans-semibold text-mj-teal-400 underline">Back to Login</Text>
                    </Pressable>
                </View>
            ) : (
                <View className="flex flex-col gap-8">
                    <View className="flex flex-col gap-2">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="font-sans-semibold">University Email</Text>
                            {errors.email && <ErrorText message={errors.email.message as string}/>}
                        </View>
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: "Email is required",
                                validate: validateUniEmail,
                            }}
                            render={({field: {onChange, value}}) => (
                                <StyledTextInput
                                    value={value}
                                    placeholder="name@university.edu"
                                    icon="mail"
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                />
                            )}
                        />
                    </View>

                    {error && <ErrorText message={error}/>}

                    <PrimaryButton
                        title={loading ? "Sending..." : "Send Reset Link"}
                        className="w-full"
                        disabled={loading}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            )}
        </View>
    );
}

export default ForgotPassword;