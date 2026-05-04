import React, {useState} from "react";
import {Text, View, Pressable, Linking} from "react-native";
import RevenueCatUI, {PAYWALL_RESULT} from "react-native-purchases-ui";
import {getCustomerInfo} from "@/src/services/purchases.service";
import {usePurchasesStore} from "@/src/stores/purchasesStore";
import {Controller, useForm} from "react-hook-form";
import * as Sentry from "@sentry/react-native";
import Toast from "react-native-toast-message";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {LinearGradient} from "expo-linear-gradient";

import {router} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {validateEmail, validatePhone} from "@/src/utils/validation";

import GradientView from "@/src/components/ui/GradientView";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import {useUpdateProfileImage, useUserDetails, useUpdateUserDetails} from "@/src/queries/user.queries";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import UserAvatar from "@/src/components/ui/UserAvatar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import ErrorText from "@/src/components/ui/ErrorText";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import {Feather} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const S = {
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden' as const,
    },
    cardTitle: {
        paddingHorizontal: 16,
        paddingTop: 15,
        paddingBottom: 11,
        fontSize: 13,
        fontFamily: 'Inter_700Bold' as const,
        color: '#374151',
    },
    row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    fullDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    iconBox: (bg: string) => ({
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: bg,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    }),
};

function UserSettings() {
    const insets = useSafeAreaInsets();
    const {user, clearSession} = useAuthStore();
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const isElite = usePurchasesStore((state) => state.isElite);
    const setCustomerInfo = usePurchasesStore((state) => state.setCustomerInfo);

    const handleUpgradePress = async () => {
        try {
            const result = await RevenueCatUI.presentPaywall();
            if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
                const info = await getCustomerInfo();
                setCustomerInfo(info);
            }
        } catch {}
    };

    const handleManageSubscription = async () => {
        try {
            await RevenueCatUI.presentCustomerCenter();
            const info = await getCustomerInfo();
            setCustomerInfo(info);
        } catch {}
    };

    const {data: userDetails, isPending: loadingUserDetails, error} = useUserDetails(user!.id);

    const isPremium = userDetails?.premiumUntil
        ? new Date(userDetails.premiumUntil) > new Date()
        : false;

    const premiumUntilFormatted = userDetails?.premiumUntil
        ? new Date(userDetails.premiumUntil).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
        : null;

    const {control, handleSubmit, formState: {errors, isDirty}, reset} = useForm({
        defaultValues: {personalEmail: '', phone: ''}
    });

    const {mutate: uploadProfileImage} = useUpdateProfileImage();
    const {mutate: updateUserDetails, isPending} = useUpdateUserDetails();

    React.useEffect(() => {
        if (userDetails) {
            reset({
                personalEmail: userDetails.personalEmail || '',
                phone: userDetails.phone || ''
            });
        }
    }, [userDetails, reset]);

    const handleAvatarUpdate = (formData: FormData) => {
        uploadProfileImage({userId: user!.id, formData}, {
            onError: () => {
                Sentry.captureException(new Error('Profile image upload failed'));
                Toast.show({type: 'error', text1: 'Failed to upload profile image', position: 'top'});
            }
        });
    };

    const onSubmit = (data: any) => {
        updateUserDetails({userId: user!.id, details: data}, {
            onSuccess: () => {
                Toast.show({type: 'success', text1: 'Personal information updated', position: 'top'});
                reset(data);
            },
            onError: () => {
                Sentry.captureException(new Error('Failed to update personal information'));
                Toast.show({type: 'error', text1: 'Failed to update personal information', position: 'top'});
            }
        });
    };

    if (loadingUserDetails) return <LoadingIndicator/>;
    if (error) return <ErrorNotLoad/>;

    return (
        <GradientView>
            {/* ── Full-screen bubble pattern ───────────────────────────── */}
            <View style={{position: 'absolute', width: '100%', height: '100%'}} pointerEvents="none">
                <View style={{position: 'absolute', top: -60,  right: -50, width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(58,111,248,0.18)'}}/>
                <View style={{position: 'absolute', top: 160,  left: -80,  width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(141,221,211,0.22)'}}/>
                <View style={{position: 'absolute', top: 420,  right: -50, width: 160, height: 160, borderRadius: 80,  backgroundColor: 'rgba(58,111,248,0.14)'}}/>
                <View style={{position: 'absolute', top: 680,  left: 40,   width: 120, height: 120, borderRadius: 60,  backgroundColor: 'rgba(141,221,211,0.18)'}}/>
                <View style={{position: 'absolute', top: 920,  right: 20,  width: 150, height: 150, borderRadius: 75,  backgroundColor: 'rgba(58,111,248,0.13)'}}/>
                <View style={{position: 'absolute', top: 1150, left: -30,  width: 110, height: 110, borderRadius: 55,  backgroundColor: 'rgba(141,221,211,0.16)'}}/>
            </View>

            <KeyboardAwareScrollView
                bottomOffset={62}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 130}}
            >
                {/* ── Avatar Section ──────────────────────────────────────── */}
                <View style={{alignItems: 'center', paddingTop: insets.top + 80, paddingBottom: 28}}>
                    <View style={isPremium
                        ? {padding: 3, borderRadius: 100, borderWidth: 2.5, borderColor: '#FCD34D', marginBottom: 12}
                        : {marginBottom: 12}
                    }>
                        <UserAvatar
                            avatarUrl={userDetails?.avatar ?? null}
                            username={userDetails?.username ?? 'User'}
                            onAvatarUpdate={handleAvatarUpdate}
                            size={96}
                            showCamera={true}
                            editable={true}
                        />
                    </View>

                    <Text style={{color: '#1A2340', fontSize: 22, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.4, textAlign: 'center'}}>
                        {userDetails?.username ?? 'User'}
                    </Text>
                    <Text style={{color: '#6B7280', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 4, textAlign: 'center'}}>
                        {userDetails?.university ?? ''}
                    </Text>

                    {isPremium && (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#FDE68A', marginTop: 10}}>
                            <Feather name="star" size={12} color="#D97706"/>
                            <Text style={{color: '#D97706', fontSize: 12, fontFamily: 'Inter_700Bold'}}>Majestor Elite</Text>
                        </View>
                    )}
                </View>

                {/* ── Cards ───────────────────────────────────────────────── */}
                <View style={{marginHorizontal: 16, marginTop: 24, gap: 12}}>

                    {/* Personal Information */}
                    <View style={S.card}>
                        <Text style={S.cardTitle}>Personal Information</Text>
                        <View style={S.fullDivider}/>
                        <View style={{paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4}}>
                            <Text style={{fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter_500Medium', marginBottom: 8}}>Personal Email</Text>
                            <Controller
                                control={control}
                                name="personalEmail"
                                rules={{required: "Personal email is required", validate: validateEmail}}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput value={value} placeholder="Enter personal email" icon="mail" onChangeText={onChange} keyboardType="email-address" size="compact"/>
                                )}
                            />
                            {errors.personalEmail && <ErrorText message={errors.personalEmail.message as string}/>}
                        </View>

                        <View style={{paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16}}>
                            <Text style={{fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter_500Medium', marginBottom: 8}}>Phone Number</Text>
                            <Controller
                                control={control}
                                name="phone"
                                rules={{required: "Phone number is required", validate: validatePhone}}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput value={value} placeholder="03xxxxxxxxx" icon="phone" onChangeText={onChange} keyboardType="phone-pad" size="compact"/>
                                )}
                            />
                            {errors.phone && <ErrorText message={errors.phone.message as string}/>}
                        </View>

                        {isDirty && (
                            <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
                                <PrimaryButton title="" icon={isPending ? "loader" : "check"} onPress={handleSubmit(onSubmit)} size="compact" disabled={isPending}/>
                            </View>
                        )}
                    </View>

                    {/* Academic Profile */}
                    <View style={S.card}>
                        <Text style={S.cardTitle}>Academic Profile</Text>
                        <View style={S.fullDivider}/>
                        <View style={{padding: 16, gap: 12}}>
                            <View>
                                <Text style={{fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter_500Medium', marginBottom: 6}}>University</Text>
                                <StyledTextInput value={userDetails.university || 'N/A'} placeholder="University" icon="home" onChangeText={() => {}} disabled size="compact"/>
                            </View>
                            <View>
                                <Text style={{fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter_500Medium', marginBottom: 6}}>Faculty</Text>
                                <StyledTextInput value={userDetails.faculty || 'N/A'} placeholder="Faculty" icon="book" onChangeText={() => {}} disabled size="compact"/>
                            </View>
                            <View>
                                <Text style={{fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter_500Medium', marginBottom: 6}}>University Email</Text>
                                <StyledTextInput value={userDetails.email || 'N/A'} placeholder="Email" icon="mail" onChangeText={() => {}} disabled size="compact"/>
                            </View>
                        </View>
                    </View>

                    {/* Roles */}
                    {userDetails.roles && userDetails.roles.length > 0 && (
                        <View style={S.card}>
                            <Text style={S.cardTitle}>Roles</Text>
                            <View style={S.fullDivider}/>
                            <View style={{padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                                {userDetails.roles.map((role, i) => (
                                    <View key={i} style={{backgroundColor: '#EEF3FF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#C7D7FD'}}>
                                        <Text style={{color: '#3A6FF8', fontFamily: 'Inter_600SemiBold', fontSize: 13}}>{role}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Subscription */}
                    {isPremium ? (
                        <Pressable
                            onPress={handleManageSubscription}
                            style={{borderRadius: 20, overflow: 'hidden'}}
                            disabled={true}
                        >
                            <LinearGradient
                                colors={['#FFFBEB', '#FEF3C7']}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                style={{padding: 18, borderWidth: 1.5, borderColor: '#FDE68A', borderRadius: 20}}
                            >
                                <Text style={{fontSize: 13, fontFamily: 'Inter_700Bold', color: '#92400E', marginBottom: 12}}>Subscription</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                        <View style={{backgroundColor: '#FDE68A', width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center'}}>
                                            <Feather name="award" size={20} color="#D97706"/>
                                        </View>
                                        <View>
                                            <Text style={{color: '#92400E', fontFamily: 'Inter_800ExtraBold', fontSize: 15}}>Majestor Elite</Text>
                                            <Text style={{color: '#B45309', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2}}>
                                                Active until {premiumUntilFormatted}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{backgroundColor: '#FDE68A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10}}>
                                        <Text style={{color: '#92400E', fontSize: 11, fontFamily: 'Inter_700Bold'}}>Manage</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleUpgradePress}
                            style={{borderRadius: 20, overflow: 'hidden'}}
                            disabled={true}
                        >
                            <LinearGradient
                                colors={['#2D5FE8', '#3A6FF8']}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                style={{padding: 18, borderRadius: 20}}
                            >
                                <Text style={{fontSize: 13, fontFamily: 'Inter_700Bold', color: 'rgba(255,255,255,0.7)', marginBottom: 12}}>Subscription</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                        <View style={{backgroundColor: 'rgba(255,255,255,0.2)', width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center'}}>
                                            <Feather name="star" size={20} color="white"/>
                                        </View>
                                        <View>
                                            <Text style={{color: 'white', fontFamily: 'Inter_800ExtraBold', fontSize: 15}}>Upgrade to Elite</Text>
                                            <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2}}>Unlock premium features</Text>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.6)"/>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    )}

                    {/* More (Notifications + Legal) */}
                    <View style={S.card}>
                        <Text style={S.cardTitle}>More</Text>
                        <View style={S.fullDivider}/>

                        <Pressable onPress={() => router.push("/notification" as any)} style={S.row}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                <View style={S.iconBox('#F3E8FF')}>
                                    <Feather name="bell" size={16} color="#7B1FA2"/>
                                </View>
                                <Text style={{color: '#1A2340', fontFamily: 'Inter_600SemiBold', fontSize: 14}}>Notifications</Text>
                            </View>
                            <Feather name="chevron-right" size={17} color="#D1D5DB"/>
                        </Pressable>

                        <View style={S.divider}/>

                        <Pressable onPress={() => Linking.openURL('https://www.majestor.org/terms')} style={S.row}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                <View style={S.iconBox('#EEF3FF')}>
                                    <Feather name="file-text" size={16} color="#3A6FF8"/>
                                </View>
                                <Text style={{color: '#1A2340', fontFamily: 'Inter_600SemiBold', fontSize: 14}}>Terms of Service</Text>
                            </View>
                            <Feather name="chevron-right" size={17} color="#D1D5DB"/>
                        </Pressable>

                        <View style={S.divider}/>

                        <Pressable onPress={() => Linking.openURL('https://www.majestor.org/privacy')} style={S.row}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                <View style={S.iconBox('#ECFDF5')}>
                                    <Feather name="shield" size={16} color="#059669"/>
                                </View>
                                <Text style={{color: '#1A2340', fontFamily: 'Inter_600SemiBold', fontSize: 14}}>Privacy Policy</Text>
                            </View>
                            <Feather name="chevron-right" size={17} color="#D1D5DB"/>
                        </Pressable>
                    </View>

                    {/* Sign Out */}
                    <View style={[S.card, {marginBottom: 8}]}>
                        <Pressable onPress={() => setShowSignOutConfirm(true)} style={S.row}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                <View style={S.iconBox('#FEF2F2')}>
                                    <Feather name="log-out" size={16} color="#DC2626"/>
                                </View>
                                <Text style={{color: '#DC2626', fontFamily: 'Inter_700Bold', fontSize: 14}}>Sign out</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <ConfirmModal
                visible={showSignOutConfirm}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmLabel="Sign Out"
                cancelLabel="Cancel"
                onConfirm={clearSession}
                onCancel={() => setShowSignOutConfirm(false)}
            />
        </GradientView>
    );
}

export default UserSettings;