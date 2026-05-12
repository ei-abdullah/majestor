import React, {useRef, useMemo, useCallback} from "react";
import {View, Text, ScrollView, RefreshControl, Pressable} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {Href, router} from "expo-router";
import {BottomSheetModal, BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Controller, useForm} from "react-hook-form";
import {LinearGradient} from "expo-linear-gradient";

import {useAuthStore} from "@/src/stores/authStore";
import {useCreateStudyGroup, useStudyHubFeed} from "@/src/queries/studyhub.queries";
import {useCourse} from "@/src/queries/course.queries";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import JoinedGroups from "./JoinedGroups";
import OfficialGroup from "./OfficialGroup";
import TrendingGroup from "./TrendingGroup";
import UniversityGroup from "./UniversityGroup";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";

export default function StudyHubFeed() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();

    const {data: feedData, isPending: loadingFeed, refetch} = useStudyHubFeed(user!.id);
    const {data: courses} = useCourse(user!.id);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["70%", "75%"], []);

    const {control, handleSubmit, reset} = useForm({
        defaultValues: {
            name: '',
            courseId: undefined,
            isPrivate: false
        }
    });

    const {mutate: createGroup, isPending: isCreating} = useCreateStudyGroup((data) => {
        reset();
        bottomSheetModalRef.current?.dismiss();
        router.push({
            pathname: "/(tabs)/studyhub/studyGroupDetail" as any,
            params: {id: data.id}
        });
    });

    const onSubmit = (data: any) => {
        if (!data.name) return;
        createGroup({
            userId: user!.id,
            payload: {
                name: data.name,
                courseId: data.courseId,
                isPrivate: data.isPrivate
            }
        });
    };

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5}/>,
        []
    );

    if (loadingFeed) return <LoadingIndicator/>;

    return (
        <View className="flex-1">
            <GradientView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingTop: insets.top + 70, paddingBottom: 140}}
                    refreshControl={
                        <RefreshControl refreshing={loadingFeed} onRefresh={refetch} tintColor="#3A6FF8"/>
                    }
                >
                    <View className="flex-row justify-end px-6 mb-4">
                        <Pressable
                            onPress={handlePresentModalPress}
                            className="w-16 h-16 bg-white rounded-full flex-row items-center justify-center shadow-sm border border-mj-blue-50"
                            style={({pressed}) => ({
                                opacity: pressed ? 0.7 : 1,
                                transform: [{scale: pressed ? 0.96 : 1}]
                            })}
                        >
                            <Feather name={"users"} size={20} color="#3A6FF8"/>
                            <Feather name={"plus"} size={20} color="#3A6FF8"/>
                        </Pressable>
                    </View>

                    <JoinedGroups groups={feedData?.joinedGroups || []}/>
                    <TrendingGroup groups={feedData?.trendingGroups || []}/>
                    <OfficialGroup groups={feedData?.officialGroups || []}/>
                    <UniversityGroup groups={feedData?.universityGroups || []}/>

                    {/* Vault Section */}
                    <View className="px-6 mt-2">
                        <Text
                            className="text-mj-text-secondary font-sans-extrabold text-[10px] uppercase tracking-[3px] mb-4 ml-1">
                            Your Documents
                        </Text>
                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => router.push("/(tabs)/studyhub/personalVault" as Href)}
                                className="flex-1"
                            >
                                <LinearGradient
                                    colors={["#EEF3FF", "#D9E6FF"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={{
                                        borderRadius: 28,
                                        padding: 22,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#C7D7FD'
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: '#3A6FF8',
                                        padding: 12,
                                        borderRadius: 18,
                                        marginBottom: 12
                                    }}>
                                        <Feather name="folder" size={22} color="white"/>
                                    </View>
                                    <Text style={{
                                        color: '#1A2340',
                                        fontFamily: 'Inter_800ExtraBold',
                                        fontSize: 13,
                                        letterSpacing: -0.3
                                    }}>Personal</Text>
                                    <Text style={{
                                        color: '#5A6275',
                                        fontSize: 9,
                                        fontFamily: 'Inter_700Bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1.5,
                                        marginTop: 3
                                    }}>
                                        Private Vault
                                    </Text>
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                onPress={() => router.push("/(tabs)/studyhub/publicVault" as Href)}
                                className="flex-1"
                            >
                                <LinearGradient
                                    colors={["#E8F9F7", "#C8F0EC"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={{
                                        borderRadius: 28,
                                        padding: 22,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#AAEAE3'
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: '#6FD0C5',
                                        padding: 12,
                                        borderRadius: 18,
                                        marginBottom: 12
                                    }}>
                                        <Feather name="unlock" size={22} color="white"/>
                                    </View>
                                    <Text style={{
                                        color: '#1A2340',
                                        fontFamily: 'Inter_800ExtraBold',
                                        fontSize: 13,
                                        letterSpacing: -0.3
                                    }}>Open</Text>
                                    <Text style={{
                                        color: '#5A6275',
                                        fontSize: 9,
                                        fontFamily: 'Inter_700Bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1.5,
                                        marginTop: 3
                                    }}>
                                        Public Vault
                                    </Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                <View style={{position: 'absolute', bottom: 130, right: 30, zIndex: 1000}}>
                    <FloatingActionButton
                        href={{
                            pathname: "/(tabs)/studyhub/uploadDocument" as any,
                            params: {destination: 'PERSONAL_VAULT'}
                        }}
                        icon={"file-text"}
                    />
                </View>
            </GradientView>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                backgroundStyle={{backgroundColor: '#FFFFFF', borderRadius: 40}}
                handleIndicatorStyle={{backgroundColor: '#E6ECFF', width: 60}}
                keyboardBehavior={"extend"}
                keyboardBlurBehavior={"restore"}
            >
                <BottomSheetView className="p-8 pb-20">
                    <Text className="text-mj-teal font-sans-extrabold text-[10px] uppercase tracking-[3px] mb-1">New
                        Community</Text>
                    <Text className="text-mj-text-main font-sans-bold text-2xl mb-8 tracking-tight">Start a Study
                        Group</Text>

                    <View className="mb-6">
                        <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Group Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({field: {onChange, value}}) => (
                                <StyledTextInput
                                    value={value}
                                    placeholder="e.g. Algorithms Prep"
                                    onChangeText={onChange}
                                    className="bg-mj-bg-light rounded-2xl"
                                    isInBottomSheet={true}
                                />
                            )}
                        />
                    </View>

                    <View className="mb-10">
                        <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">
                            Associated Course{' '}
                            <Text className="text-mj-text-secondary font-sans">(optional)</Text>
                        </Text>
                        <Text className={"text-mj-text-secondary text-xs font-sans-medium mb-2 ml-1"}>
                            Or leave blank for global community not tied to any specific course
                        </Text>
                        <Controller
                            control={control}
                            name="courseId"
                            render={({field: {onChange, value}}) => (
                                <StyledModalWithSearch
                                    value={value}
                                    onChange={onChange}
                                    options={courses?.data.courses || []}
                                    placeholder="Select course"
                                />
                            )}
                        />
                    </View>

                    <View className="mb-10">
                        <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Group Visibility</Text>
                        <Controller
                            control={control}
                            name="isPrivate"
                            render={({field: {onChange, value}}) => (
                                <View className="flex-row items-center gap-3">
                                    <Pressable onPress={() => onChange(!value)}>
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
                                    <Text className="text-mj-text-main font-sans-semibold">Make this group
                                        private</Text>
                                </View>
                            )}
                        />
                    </View>

                    <Pressable
                        className={`bg-mj-blue-600 py-5 rounded-[22px] items-center justify-center shadow-blue ${isCreating ? 'opacity-70' : ''}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isCreating}
                    >
                        {isCreating
                            ? <LoadingIndicator size={20}/>
                            : <Text className="text-white font-sans-bold text-lg">Launch Group</Text>
                        }
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
}