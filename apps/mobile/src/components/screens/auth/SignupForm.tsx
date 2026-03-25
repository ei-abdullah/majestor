import React, {useEffect} from "react";
import {Text, View, Linking, Pressable} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {isAxiosError} from "axios";
import {LinearGradient} from "expo-linear-gradient";
import {Feather} from "@expo/vector-icons";

import {useAcademiaStore} from "@/src/stores/academiaStore";
import {signup} from "@/src/services/auth.api";

import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import {validateUniEmail} from "@/src/utils/validation";
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
    const {control, watch, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            university: "",
            faculty: "",
            isFaculty: false,
            termsAccepted: false
        }
    });
    const {universities, fetchUniversities, isLoading: universitiesLoading, error} = useAcademiaStore();

    const selectedUniversity = watch("university");
    const termsAccepted = watch("termsAccepted");

    const faculties = selectedUniversity
        ? universities.find(university => university.id === parseInt(selectedUniversity))?.faculties || []
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
                facultyId: data.faculty,
                isFaculty: data.isFaculty
            }

            delete newData.university;
            delete newData.faculty;
            delete newData.termsAccepted;

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
                    <Text className={"font-semibold text-mj-text-main"}>Username</Text>
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
                    <Text className={"font-semibold text-mj-text-main"}>University Email</Text>
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
                        validate: validateUniEmail
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
                {
                    allowedDomains.length > 0 && (
                        <Text className="text-xs text-mj-text-secondary mt-1">
                            Accepted domains: {allowedDomains.map(d => `@${d}`).join(", ")}
                        </Text>
                    )
                }
            </View>

            {/* Password */}
            <View className={"flex flex-col gap-2"}>
                <View className={"flex flex-row justify-between items-end"}>
                    <Text className={"font-semibold text-mj-text-main"}>Password</Text>
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
                    <Text className={"font-semibold text-mj-text-main"}>University</Text>
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
                            <Text className={"font-semibold text-mj-text-main"}>Faculty</Text>
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

            {/* Faculty Checkbox */}
            <View className="flex-col gap-2">
                <Controller
                    control={control}
                    name="isFaculty"
                    render={({field: {onChange, value}}) => (
                        <View className="flex-row items-center gap-3">
                            <Pressable
                                onPress={() => onChange(!value)}
                            >
                                {value ? (
                                    <LinearGradient
                                        colors={["#3A6FF8", "#8DDDD3"]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                        className="w-6 h-6 rounded-md items-center justify-center"
                                    >
                                        <Feather name="check" size={16} color="white"/>
                                    </LinearGradient>
                                ) : (
                                    <View className="w-6 h-6 rounded-md border-2 border-gray-400 bg-white"/>
                                )}
                            </Pressable>
                            <Text className="text-mj-text-main font-semibold">Sign up as Faculty?</Text>
                        </View>
                    )}
                />
            </View>

            {/* Terms and Privacy Checkbox */}
            <View className="flex-col gap-2">
                <Controller
                    control={control}
                    name="termsAccepted"
                    render={({field: {onChange, value}}) => (
                        <View className="flex-row items-start gap-3">
                            <Pressable
                                onPress={() => onChange(!value)}
                                className="mt-0.5"
                            >
                                {value ? (
                                    <LinearGradient
                                        colors={["#3A6FF8", "#8DDDD3"]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                        className="w-6 h-6 rounded-md items-center justify-center"
                                    >
                                        <Feather name="check" size={16} color="white"/>
                                    </LinearGradient>
                                ) : (
                                    <View className="w-6 h-6 rounded-md border-2 border-gray-400 bg-white"/>
                                )}
                            </Pressable>

                            <View className="flex-1">
                                <Text className="text-sm text-mj-text-secondary leading-5">
                                    I agree to the{" "}
                                    <Text
                                        onPress={() => Linking.openURL('https://www.majestor.org/terms')}
                                        className="text-mj-blue font-semibold"
                                    >
                                        Terms of Service
                                    </Text>
                                    {" "}and{" "}
                                    <Text
                                        onPress={() => Linking.openURL('https://www.majestor.org/privacy')}
                                        className="text-mj-blue font-semibold"
                                    >
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <PrimaryButton
                title={loading ? "Loading..." : "Create Account"}
                className={"w-full"}
                disabled={loading || !termsAccepted}
                onPress={handleSubmit(onSubmit)}/>
        </View>
    );
}

export default SignupForm;