import React from "react";
import {Text, View, ScrollView, Alert, Pressable} from "react-native";
import {Controller, useForm} from "react-hook-form";

import {useAuthStore} from "@/src/stores/authStore";
import {validateEmail, validatePhone} from "@/src/utils/validation";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import {useUpdateProfileImage, useUserDetails, useUpdateUserDetails} from "@/src/queries/user.queries";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import UserAvatar from "@/src/components/ui/UserAvatar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import ErrorText from "@/src/components/ui/ErrorText";
import {Feather} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

function UserSettings() {
    const insets = useSafeAreaInsets();
    const headerOffset = insets.top + 76;
    const {user, clearSession} = useAuthStore();

    const {
        data: userDetails,
        isPending: loadingUserDetails,
        error
    } = useUserDetails(user!.id);

    const {control, handleSubmit, formState: {errors, isDirty}, reset} = useForm({
        defaultValues: {
            personalEmail: '',
            phone: ''
        }
    });

    const {mutate: uploadProfileImage} = useUpdateProfileImage();
    const {mutate: updateUserDetails, isPending} = useUpdateUserDetails();

    // Initialize form when userDetails loads
    React.useEffect(() => {
        if (userDetails) {
            reset({
                personalEmail: userDetails.personalEmail || '',
                phone: userDetails.phone || ''
            });
        }
    }, [userDetails, reset]);

    const handleAvatarUpdate = (formData: FormData) => {
        const userId = user!.id;
        uploadProfileImage({userId, formData}, {
            onError: (error: any) => {
                console.error('Upload error:', error);
                Alert.alert('Error', 'Failed to upload profile image');
            }
        });
    };

    const onSubmit = (data: any) => {
        const userId = user!.id;
        updateUserDetails({userId, details: data}, {
            onSuccess: () => {
                Alert.alert('Success', 'Personal information updated successfully');
                reset(data);
            },
            onError: (error: any) => {
                console.error('Update error:', error);
                Alert.alert('Error', 'Failed to update personal information');
            }
        });
    };

    if (loadingUserDetails) {
        return <LoadingIndicator/>
    }

    if (error) {
        return <ErrorNotLoad/>
    }

    return (
        <GradientView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 130, paddingTop: headerOffset}}
            >
                <View className={"mx-4"}>
                    {/* Avatar Section */}
                    <View className="items-center mt-8 mb-8">
                        <UserAvatar
                            avatarUrl={userDetails.avatar}
                            username={userDetails.username}
                            onAvatarUpdate={handleAvatarUpdate}
                            size={128}
                            showCamera={true}
                            editable={true}
                        />
                    </View>

                    {/* University Information */}
                    <Text className="text-lg font-bold text-gray-800 mb-3 mx-4">University Information</Text>
                    <Card className="px-5 py-6 mb-6 mx-4">
                        {/* Full Name */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-2">Username</Text>
                            <StyledTextInput
                                value={userDetails.username || 'N/A'}
                                placeholder="Full Name"
                                icon="user"
                                onChangeText={() => {
                                }}
                                disabled={true}
                                size="compact"
                            />
                        </View>

                        {/* University Name */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-2">University Name</Text>
                            <StyledTextInput
                                value={userDetails.university || 'N/A'}
                                placeholder="University Name"
                                icon="home"
                                onChangeText={() => {
                                }}
                                disabled={true}
                                size="compact"
                            />
                        </View>

                        {/* Faculty Name */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-2">Faculty Name</Text>
                            <StyledTextInput
                                value={userDetails.faculty || 'N/A'}
                                placeholder="Faculty Name"
                                icon="book"
                                onChangeText={() => {
                                }}
                                disabled={true}
                                size="compact"
                            />
                        </View>

                        {/* University Email */}
                        <View>
                            <Text className="text-sm text-gray-500 mb-2">University Email</Text>
                            <StyledTextInput
                                value={userDetails.email || 'N/A'}
                                placeholder="University Email"
                                icon="mail"
                                onChangeText={() => {
                                }}
                                disabled={true}
                                size="compact"
                            />
                        </View>
                    </Card>

                    {/* Personal Information */}
                    <Text className="text-lg font-bold text-gray-800 mb-3 mx-4">Personal Information</Text>
                    <Card className="px-5 py-6 mb-6 mx-4">
                        {/* Personal Email */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-2">Personal Email</Text>
                            <Controller
                                control={control}
                                name="personalEmail"
                                rules={{
                                    required: "Personal email is required",
                                    validate: validateEmail
                                }}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput
                                        value={value}
                                        placeholder="Enter personal email"
                                        icon="mail"
                                        onChangeText={onChange}
                                        keyboardType="email-address"
                                        size="compact"
                                    />
                                )}
                            />
                            {
                                errors.personalEmail &&
                                <ErrorText message={errors.personalEmail.message as string}/>
                            }
                        </View>

                        {/* Phone Number */}
                        <View className={isDirty ? "mb-4" : ""}>
                            <Text className="text-sm text-gray-500 mb-2">Phone Number</Text>
                            <Controller
                                control={control}
                                name="phone"
                                rules={{
                                    required: "Phone number is required",
                                    validate: validatePhone
                                }}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput
                                        value={value}
                                        placeholder="03xxxxxxxxx"
                                        icon="phone"
                                        onChangeText={onChange}
                                        keyboardType="phone-pad"
                                        size="compact"
                                    />
                                )}
                            />
                            {
                                errors.phone &&
                                <ErrorText message={errors.phone.message as string}/>
                            }
                        </View>

                        {/* Update Button - Only show when there are changes */}
                        {isDirty && (
                            <View className="mt-2">
                                <PrimaryButton
                                    title=""
                                    icon={isPending? "loader" : "check"}
                                    onPress={handleSubmit(onSubmit)}
                                    size="compact"
                                    disabled={isPending}
                                />
                            </View>
                        )}
                    </Card>

                    {/* Your Roles */}
                    <Text className="text-lg font-bold text-gray-800 mb-3 mx-4">Your Roles</Text>
                    <Card className="px-5 py-5 mb-6 mx-4">
                        <View className="flex-row flex-wrap gap-2">
                            {userDetails.roles && userDetails.roles.length > 0 ? (
                                userDetails.roles.map((role, index) => (
                                    <View key={index}
                                          className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                        <Text className="text-blue-600 font-medium text-sm">
                                            {role}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-gray-500 text-sm">No roles assigned</Text>
                            )}
                        </View>
                    </Card>

                    {/* Logout */}
                    <Card className="py-0 mx-4 mb-2 px-5 overflow-hidden">
                        <Pressable
                            onPress={() =>
                                Alert.alert(
                                    'Sign out',
                                    'Are you sure you want to sign out?',
                                    [
                                        {text: 'Cancel', style: 'cancel'},
                                        {text: 'Sign out', style: 'destructive', onPress: clearSession},
                                    ]
                                )
                            }
                            className="flex-row items-center gap-4 active:opacity-60"
                        >
                            <View className="bg-red-100 rounded-xl p-2">
                                <Feather name="log-out" size={18} color="#DC2626" />
                            </View>
                            <Text className="text-red-600 font-semibold text-base">
                                Sign out
                            </Text>
                        </Pressable>
                    </Card>
                </View>
            </ScrollView>
        </GradientView>
    );

}

export default UserSettings;