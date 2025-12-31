import React, {useState} from "react";
import {Text, View, ScrollView, Alert} from "react-native";

import {useAuthStore} from "@/src/stores/authStore";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import {useUpdateProfileImage, useUserDetails, useUpdateUserDetails} from "@/src/queries/user.queries";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import UserAvatar from "@/src/components/ui/UserAvatar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";

function UserSettings() {
    const {user} = useAuthStore();

    const {
        data: userDetails,
        isPending: loadingUserDetails,
        error
    } = useUserDetails(user!.id);

    const [personalEmail, setPersonalEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const {mutate: uploadProfileImage} = useUpdateProfileImage();
    const {mutate: updateUserDetails} = useUpdateUserDetails();

    // Initialize state when userDetails loads
    React.useEffect(() => {
        if (userDetails) {
            setPersonalEmail(userDetails.personalEmail || '');
            setPhone(userDetails.phone || '');
        }
    }, [userDetails]);

    // Check if any field has changed
    const hasChanges =
        personalEmail !== (userDetails?.personalEmail || '') ||
        phone !== (userDetails?.phone || '');

    const handleAvatarUpdate = (formData: FormData) => {
        const userId = user!.id;
        uploadProfileImage({userId, formData}, {
            onSuccess: () => {
                Alert.alert('Success', 'Profile image updated successfully');
            },
            onError: (error: any) => {
                console.error('Upload error:', error);
                Alert.alert('Error', 'Failed to upload profile image');
            }
        });
    };

    const handleUpdatePersonalInfo = () => {
        const userId = user!.id;
        updateUserDetails({userId, details: {personalEmail, phone}}, {
            onSuccess: () => {
                Alert.alert('Success', 'Personal information updated successfully');
            },
            onError: (error: any) => {
                console.error('Update error:', error);
                Alert.alert('Error', 'Failed to update personal information');
            }
        });
    };

    if (loadingUserDetails) {
        return <LoadingIndicator />
    }

    if (error) {
        return <ErrorNotLoad />
    }

    return (
        <GradientView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 40}}
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
                                onChangeText={() => {}}
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
                                onChangeText={() => {}}
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
                                onChangeText={() => {}}
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
                                onChangeText={() => {}}
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
                            <StyledTextInput
                                value={personalEmail}
                                placeholder="Enter personal email"
                                icon="mail"
                                onChangeText={setPersonalEmail}
                                keyboardType="email-address"
                                size="compact"
                            />
                        </View>

                        {/* Phone Number */}
                        <View className={hasChanges ? "mb-4" : ""}>
                            <Text className="text-sm text-gray-500 mb-2">Phone Number</Text>
                            <StyledTextInput
                                value={phone}
                                placeholder="Enter phone number"
                                icon="phone"
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                size="compact"
                            />
                        </View>

                        {/* Update Button - Only show when there are changes */}
                        {hasChanges && (
                            <View className="mt-2">
                                <PrimaryButton
                                    title=""
                                    icon="check"
                                    onPress={handleUpdatePersonalInfo}
                                    size="compact"
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
                                    <View key={index} className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
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
                </View>
            </ScrollView>
        </GradientView>
    );

}

export default UserSettings;