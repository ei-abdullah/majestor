import React, {useRef, useMemo, useCallback} from "react";
import {View, Text, ScrollView, RefreshControl, TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";
import {BottomSheetModal, BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Controller, useForm} from "react-hook-form";

import {useAuthStore} from "@/src/stores/authStore";
import {useCreateStudyGroup, useStudyHubFeed} from "@/src/queries/studyhub.queries";
import {useCourse} from "@/src/queries/course.queries";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";

import JoinedGroups from "./JoinedGroups";
import OfficialGroup from "./OfficialGroup";
import TrendingGroup from "./TrendingGroup";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";

export default function StudyHubFeed() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    
    const {data: feedData, isPending: loadingFeed, refetch} = useStudyHubFeed(user!.id);
    const {data: courses} = useCourse(user!.id);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["60%"], []);
    
    const {control, handleSubmit, reset} = useForm({
        defaultValues: {name: '', courseId: undefined}
    });

    const {mutate: createGroup, isPending: isCreating} = useCreateStudyGroup((data) => {
        reset();
        bottomSheetModalRef.current?.dismiss();
        router.push({
            pathname: "/(tabs)/studyhub/studyGroupDetail",
            params: {id: data.id}
        });
    });

    const onSubmit = (data: any) => {
        if (!data.name || !data.courseId) return;
        createGroup({
            userId: user!.id,
            payload: {
                name: data.name,
                courseId: data.courseId
            }
        });
    };

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
        []
    );

    if (loadingFeed) return <LoadingIndicator />;

    return (
        <View className="flex-1">
            <GradientView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: insets.top + 80,
                        paddingBottom: 140
                    }}
                    refreshControl={
                        <RefreshControl refreshing={loadingFeed} onRefresh={refetch} tintColor="#3A6FF8"/>
                    }
                >
                    <JoinedGroups groups={feedData?.joinedGroups || []}/>
                    <OfficialGroup groups={feedData?.officialGroups || []}/>
                    <TrendingGroup groups={feedData?.trendingGroups || []}/>

                    <View className="px-6 mt-4 flex-row gap-4">
                        <TouchableOpacity 
                            onPress={() => router.push("/(tabs)/studyhub/personalVault")}
                            className="flex-1" 
                            activeOpacity={0.9}
                        >
                            <Card className="items-center py-8 bg-white shadow-sm rounded-[32px] border border-mj-bg-blue">
                                <View className="bg-mj-blue-50 p-4 rounded-2xl mb-3">
                                    <Feather name="folder" size={28} color="#3A6FF8"/>
                                </View>
                                <Text className="text-mj-text-main font-bold text-base">PERSONAL</Text>
                                <Text className="text-mj-text-secondary text-[10px] font-black tracking-widest uppercase mt-0.5">Private Vault</Text>
                            </Card>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => router.push("/(tabs)/studyhub/publicVault")} 
                            className="flex-1"
                            activeOpacity={0.9}
                        >
                            <Card className="items-center py-8 bg-white shadow-sm rounded-[32px] border border-mj-bg-blue">
                                <View className="bg-mj-teal-50 p-4 rounded-2xl mb-3">
                                    <Feather name="unlock" size={28} color="#6FD0C5"/>
                                </View>
                                <Text className="text-mj-text-main font-bold text-base">OPEN</Text>
                                <Text className="text-mj-text-secondary text-[10px] font-black tracking-widest uppercase mt-0.5">Public Vault</Text>
                            </Card>
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 mt-8">
                        <TouchableOpacity
                            onPress={handlePresentModalPress}
                            className="bg-mj-blue-600 py-5 rounded-[32px] flex-row items-center justify-center shadow-blue"
                            activeOpacity={0.8}
                        >
                            <Feather name="plus-circle" size={22} color="white"/>
                            <Text className="text-white font-bold ml-3 text-lg">Create New Group</Text>
                        </TouchableOpacity>
                        <Text className="text-center text-mj-text-secondary text-[9px] font-black mt-4 tracking-[2px] uppercase">
                            {user?.premiumUntil ? "Elite Access Active" : "Standard Tier • 1 Slot Available"}
                        </Text>
                    </View>
                </ScrollView>
            </GradientView>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                backgroundStyle={{backgroundColor: '#FFFFFF', borderRadius: 40}}
                handleIndicatorStyle={{backgroundColor: '#E6ECFF', width: 60}}
            >
                <BottomSheetView className="p-8 pb-20">
                    <Text className="text-mj-teal font-black text-[10px] uppercase tracking-[3px] mb-1">New Community</Text>
                    <Text className="text-mj-text-main font-bold text-2xl mb-8 tracking-tight">Start a Study Group</Text>

                    <View className="mb-6">
                        <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Group Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({field: {onChange, value}}) => (
                                <StyledTextInput
                                    value={value}
                                    placeholder="e.g. Algorithms Prep"
                                    onChangeText={onChange}
                                    className="bg-mj-bg-light rounded-2xl"
                                />
                            )}
                        />
                    </View>

                    <View className="mb-10">
                        <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Associated Course</Text>
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

                    <TouchableOpacity
                        className={`bg-mj-blue-600 py-5 rounded-[22px] items-center justify-center shadow-blue ${isCreating ? 'opacity-70' : ''}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isCreating}
                    >
                        {isCreating ? <LoadingIndicator /> : <Text className="text-white font-bold text-lg">Launch Group</Text>}
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
}
