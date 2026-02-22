import React, {useEffect} from "react";
import {Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {isAxiosError} from "axios";

import {useAcademiaStore} from "@/src/stores/academiaStore";
import {signup} from "@/src/services/auth.api";

import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import {validateCustEmail} from "@/src/utils/validation";
import ErrorText from "@/src/components/ui/ErrorText";

interface Option {
    name: "error" | "success",
    message: string
}

interface Props {
    loading: boolean,
    setLoading: (loading: boolean) => void,
    setMessage: (option: Option | null) => void,
    setTab: (tab: "Login") => void
}

function SignupForm({loading, setLoading, setMessage, setTab}: Props) {
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
                    {
                        errors.username &&
                        <ErrorText message={errors.username.message as string}/>
                    }
                </View>
                <Controller
                    control={control}
                    name="username"
                    rules={{
                        required: {value: true, message: "Username is required"}
                    }}
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
                    {
                        errors.email &&
                        <ErrorText message={errors.email.message as string}/>
                    }
                </View>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: {value: true, message: "Email is required"},
                        validate: validateCustEmail
                    }}
                    render={({field: {onChange, value}}) => (
                        <StyledTextInput
                            value={value}
                            placeholder={"BCS233000@cust.pk"}
                            icon="mail"
                            onChangeText={onChange}
                            keyboardType="email-address"
                        />
                    )}
                />
            </View>

            {/* Password */}
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-end"}>
                    <Text className={"font-semibold"}>Password</Text>
                    {
                        errors.password &&
                        <ErrorText message={errors.password.message as string}/>
                    }

                </View>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: {value: true, message: "Password is required"}
                    }}
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
                    {
                        errors.university &&
                        <ErrorText message={errors.university.message as string}/>
                    }
                </View>
                {
                    <Controller
                        control={control}
                        name="university"
                        rules={{
                            required: {value: true, message: "University is required"}
                        }}
                        render={({field: {onChange, value}}) => (
                            <StyledModalWithSearch
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
                            {
                                errors.faculty &&
                                <ErrorText message={errors.faculty.message as string}/>
                            }
                        </View>
                        <Controller
                            control={control}
                            name="faculty"
                            rules={{
                                required: {value: true, message: "Faculty is required"}
                            }}
                            render={({field: {onChange, value}}) => (
                                <StyledModalWithSearch
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