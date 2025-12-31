import React, {useEffect} from "react";
import {Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {isAxiosError} from "axios";

import {useAcademiaStore} from "@/src/stores/academiaStore";
import {signup} from "@/src/services/auth.api";

import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import StyledAuthModal from "@/src/components/screens/auth/StyledAuthModal";

type option = {
    name: "error" | "success";
    message: string;
}

type props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setMessage: (option: option | null) => void;
    setTab: (tab: "Login") => void;
}

function SignupForm({loading, setLoading, setMessage, setTab}: props) {
    const {control, watch, handleSubmit, formState: {errors}} = useForm();
    const {universities, fetchUniversities, isLoading: universitiesLoading, error} = useAcademiaStore();

    const selectedUniversity = watch("university");
    const faculties = selectedUniversity
        ? universities.find(university => university.id === selectedUniversity)?.faculties || []
        : [];

    useEffect(() => {
        fetchUniversities()
            .then(r => null)
            .catch((e: any) => setMessage({
                name: "error",
                message: e.message || "Something went wrong. Please try again later!"
            }));
    }, [])


    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setMessage(null);

            const newData = {
                ...data,
                universityId: data.university,
                facultyId: data.faculty
            }

            delete newData.university;
            delete newData.faculty;

            const response = await signup(newData);
            setMessage({
                name: "success",
                message: response.data.message
            });
            setTab("Login");
        } catch (error: any) {
            if (isAxiosError(error)) {
                if (error.response?.status == 404) {
                    setMessage({
                        "name": "error",
                        "message": error.response.data.message
                    })
                } else if (error.response?.data?.message) {
                    setMessage({
                        "name": "error",
                        "message": error.response.data.message
                    })
                } else {
                    setMessage({
                        "name": "error",
                        "message": "Something went wrong. Please try again later!"
                    })
                }
            } else {
                setMessage({
                    "name": "error",
                    "message": "Something went wrong. Please try again later!"
                })
            }
        } finally {
            setLoading(false);
        }
    }

    if (universitiesLoading) {
        return (
            <View className={"flex justify-center items-center py-16"}>
                <Text>
                    {/* Display a loading spinner here */}
                    Loading...
                </Text>
            </View>
        )

    }

    return (
        <View className={"flex flex-col gap-8 w-full"}>

            {/* Username */}
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-center"}>
                    <Text className={"font-semibold"}>Username</Text>
                    {errors.username &&
                        <Text className={"text-mj-error text-xs font-semibold"}>Username is required.</Text>
                    }
                </View>
                <Controller
                    control={control}
                    name="username"
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                        <StyledTextInput
                            value={value}
                            placeholder={"Murat"}
                            icon="user"
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            {/* University Email */}
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

            {/* Password */}
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

            {/* University */}
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-end"}>
                    <Text className={"font-semibold"}>University</Text>
                    {errors.university &&
                        <Text className={"text-mj-error text-xs font-semibold"}>University is required.</Text>
                    }
                </View>
                {
                    <Controller
                        control={control}
                        name="university"
                        rules={{required: true}}
                        render={({field: {onChange, value}}) => (
                            <StyledAuthModal
                                value={value}
                                onChange={onChange}
                                options={universities}
                                placeholder={"University"}
                                label={"Universities"}
                                icon={"pen-tool"}
                            />
                        )}
                    />
                }
            </View>

            {/* Faculty */}
            {
                selectedUniversity && (
                    <View className={"flex flex-col gap-2"}>
                        <View className={"flex flex-row justify-between items-end"}>
                            <Text className={"font-semibold"}>Faculty</Text>
                            {errors.faculty &&
                                <Text className={"text-mj-error text-xs font-semibold"}>Faculty is required.</Text>
                            }
                        </View>
                        <Controller
                            control={control}
                            name="faculty"
                            rules={{required: true}}
                            render={({field: {onChange, value}}) => (
                                <StyledAuthModal
                                    value={value}
                                    onChange={onChange}
                                    options={faculties}
                                    placeholder={"Faculty"}
                                    label={"Faculties"}
                                    icon={"book"}
                                />
                            )}
                        />
                    </View>
                )
            }

            <PrimaryButton
                title={loading ? "Loading..." : "Create Account"} className={"w-full"} disabled={loading}
                onPress={handleSubmit(onSubmit)}/>
        </View>
    );
}

export default SignupForm;