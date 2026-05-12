import React, {useEffect, useState} from "react";
import {Text, View, Pressable, StyleSheet} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {router} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

import {semesterType, type} from "@/src/constants";
import {useAuthStore} from "@/src/stores/authStore";
import {useCourse} from "@/src/queries/course.queries";
import {useUploadDocument, useStudyHubFeed} from "@/src/queries/studyhub.queries";

import GradientView from "@/src/components/ui/GradientView";
import ImageUpload from "@/src/components/ui/ImageUpload";
import ImageCarousel from "@/src/components/ui/ImageCarousel";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import Card from "@/src/components/ui/Card";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const DESTINATIONS = [
    {label: "Private Vault", value: "PERSONAL_VAULT", icon: "lock"},
    {label: "Open Vault", value: "PUBLIC_VAULT", icon: "globe"},
    {label: "Study Group", value: "STUDY_GROUP", icon: "users"}
];

const styles = StyleSheet.create({
    destinationButton: {
        flex: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    destinationButtonActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        shadowColor: '#3A6FF8',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    destinationButtonInactive: {
        backgroundColor: 'rgba(96,89,89,0.1)',
        borderColor: 'rgba(170,170,170,0)',
    },
    destinationText: {
        fontSize: 8,
        fontFamily: 'Inter_800ExtraBold',
        textTransform: 'uppercase',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    destinationTextActive: {
        color: '#3A6FF8',
    },
    destinationTextInactive: {
        color: 'rgba(255, 255, 255, 0.6)',
    },
});

interface UploadDocumentProps {
    initialDestination?: string;
    initialCourseId?: number;
    initialStudyGroupId?: number;
}

function UploadDocument({initialDestination, initialCourseId, initialStudyGroupId}: UploadDocumentProps) {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();

    const {control, handleSubmit, reset, watch, setValue, formState: {errors}} = useForm({
        defaultValues: {
            title: '',
            documentType: undefined,
            semesterType: undefined,
            uploadedYear: new Date().getFullYear(),
            courseId: initialCourseId,
            studyGroupId: initialStudyGroupId,
            destination: (initialDestination || 'PERSONAL_VAULT') as any,
            isPremiumOnly: true
        },
        mode: "onBlur"
    });

    const [images, setImages] = useState<string[]>([]);
    const selectedDestination = watch("destination");

    useEffect(() => {
        if (selectedDestination === 'PERSONAL_VAULT') {
            setValue('studyGroupId', undefined);
        } else if (selectedDestination === 'PUBLIC_VAULT') {
            setValue('studyGroupId', undefined);
        } else if (selectedDestination === 'STUDY_GROUP') {
            if (!initialStudyGroupId) {
                setValue('studyGroupId', undefined);
            }
        }
    }, [selectedDestination, setValue, initialStudyGroupId]);

    function handleReset() {
        reset();
        setImages([]);
    }

    const {
        mutate: uploadDocument,
        isPending: isUploading
    } = useUploadDocument(() => {
        handleReset();
        router.back();
    });

    const {data: courses, isPending: loadingCourses} = useCourse(user!.id);
    const {data: feedData} = useStudyHubFeed(user!.id);
    const joinedGroups = feedData?.joinedGroups || [];

    const onSubmit = async (data: any) => {
        if (images.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'No Images Selected',
                text2: 'Please add at least one image of the document to upload.'
            })
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('documentType', data.documentType);
        formData.append('semesterType', data.semesterType);
        formData.append('uploadedYear', data.uploadedYear.toString());
        formData.append('destination', data.destination);
        formData.append('isPremiumOnly', data.isPremiumOnly.toString());

        if (data.courseId) formData.append('courseId', data.courseId.toString());
        if (data.studyGroupId && data.destination === 'STUDY_GROUP') {
            formData.append('studyGroupId', data.studyGroupId.toString());
        }

        images.forEach((uri, index) => {
            const imageFile = {
                uri: uri,
                name: `document_${index}.jpg`,
                type: 'image/jpeg'
            } as any;
            formData.append('documentImages', imageFile);
        });

        uploadDocument({userId: user!.id, formData});
    }

    if (loadingCourses) return <LoadingIndicator/>;

    return (
        <GradientView>
            <KeyboardAwareScrollView
                bottomOffset={62}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 140, paddingTop: insets.top + 80}}
            >
                <View className="mx-6">
                    {/* Step 1: Destination Selection */}
                    <View style={{marginBottom: 24, flexDirection: 'row', gap: 8}}>
                        <Controller
                            control={control}
                            name="destination"
                            render={({field: {onChange, value}}) => (
                                <View style={{flexDirection: 'row', gap: 8, flex: 1}}>
                                    {DESTINATIONS.map((dest) => {
                                        const isActive = value === dest.value;
                                        return (
                                            <Pressable
                                                key={dest.value}
                                                onPress={() => onChange(dest.value)}
                                                style={[
                                                    styles.destinationButton,
                                                    isActive ? styles.destinationButtonActive : styles.destinationButtonInactive
                                                ]}
                                            >
                                                <Feather name={dest.icon as any} size={18}
                                                         color={isActive ? "#3A6FF8" : "white"}/>
                                                <Text style={[
                                                    styles.destinationText,
                                                    isActive ? styles.destinationTextActive : styles.destinationTextInactive
                                                ]}>
                                                    {dest.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        />
                    </View>

                    {/* Step 2: Image Selection */}
                    <Card className="p-4 bg-white rounded-3xl shadow-blue border-0 mb-6">
                        <Text
                            className="text-mj-text-secondary text-[10px] font-sans-bold uppercase tracking-wider mb-4 px-2">Document
                            Images</Text>
                        {images.length > 0 ? (
                            <ImageCarousel images={images} onImagesChange={setImages} height={250}/>
                        ) : (
                            <ImageUpload onImagesChange={setImages}/>
                        )}
                    </Card>

                    {/* Step 3: Metadata */}
                    <Card className="p-6 bg-white rounded-3xl shadow-blue border-0">
                        <Text className="text-mj-text-secondary text-[10px] font-sans-bold uppercase tracking-wider mb-6">Document
                            Details</Text>

                        {/* Title */}
                        <View className="mb-6">
                            <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Title</Text>
                            <Controller
                                control={control}
                                name="title"
                                rules={{required: true}}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput value={value} placeholder="e.g. Final Exam Prep"
                                                     onChangeText={onChange} className="bg-mj-bg-light rounded-2xl"/>
                                )}
                            />
                        </View>

                        {/* Course (Optional for Personal) */}
                        <View className="mb-6">
                            <Text
                                className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Course {selectedDestination === 'PERSONAL_VAULT' ? '(Optional)' : '*'}</Text>
                            <Controller
                                control={control}
                                name="courseId"
                                rules={{required: selectedDestination !== 'PERSONAL_VAULT'}}
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

                        {/* Study Group (Only for Study Group destination) */}
                        {selectedDestination === 'STUDY_GROUP' && (
                            <View className="mb-6">
                                <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Study Group *</Text>
                                <Controller
                                    control={control}
                                    name="studyGroupId"
                                    rules={{required: true}}
                                    render={({field: {onChange, value}}) => (
                                        <StyledModalWithSearch
                                            value={value}
                                            onChange={onChange}
                                            options={joinedGroups}
                                            placeholder="Select study group"
                                        />
                                    )}
                                />
                            </View>
                        )}

                        {/* Type & Semester Row */}
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Type</Text>
                                <Controller
                                    control={control}
                                    name="documentType"
                                    rules={{required: true}}
                                    render={({field: {onChange, value}}) => (
                                        <StyledDropDown options={type} value={value} onChange={onChange}
                                                        size="compact" className="bg-mj-bg-light rounded-2xl"/>
                                    )}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-mj-text-main text-sm font-sans-bold mb-2 ml-1">Semester</Text>
                                <Controller
                                    control={control}
                                    name="semesterType"
                                    rules={{required: true}}
                                    render={({field: {onChange, value}}) => (
                                        <StyledDropDown options={semesterType} value={value} onChange={onChange}
                                                        size="compact" className="bg-mj-bg-light rounded-2xl"/>
                                    )}
                                />
                            </View>
                        </View>

                        {/* Premium Checkbox */}
                        <View
                            className="flex-row items-center justify-between bg-mj-blue-50 p-4 rounded-2xl border border-mj-blue-100">
                            <View className="flex-1 mr-4">
                                <Text className="text-mj-blue-900 font-sans-bold text-sm">Premium Content</Text>
                                <Text className="text-mj-blue-700 text-[10px]">Restricts access to Elite members
                                    only.</Text>
                            </View>
                            <Controller
                                control={control}
                                name="isPremiumOnly"
                                render={({field: {onChange, value}}) => (
                                    <Pressable
                                        onPress={() => onChange(!value)}
                                        className={`w-10 h-10 rounded-xl items-center justify-center ${value ? 'bg-mj-blue shadow-blue' : 'bg-white border border-mj-blue-200'}`}
                                    >
                                        <Feather name={value ? "check" : "square"} size={20}
                                                 color={value ? "white" : "#A3BFFF"}/>
                                    </Pressable>
                                )}
                            />
                        </View>
                    </Card>

                    {/* Action Buttons */}
                    <View className="mt-8 flex-row gap-4">
                        <Pressable
                            onPress={handleReset}
                            className="flex-1 py-5 rounded-3xl bg-mj-bg-light items-center justify-center border border-mj-bg-blue"
                        >
                            <Text className="text-mj-text-secondary font-sans-bold">Reset</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleSubmit(onSubmit)}
                            disabled={isUploading}
                            className="flex-[2] py-5 rounded-3xl bg-mj-blue-600 items-center justify-center shadow-blue"
                        >
                            {isUploading ? (
                                <LoadingIndicator size={24}/>
                            ) : (
                                <View className="flex-row items-center">
                                    <Feather name="upload-cloud" size={20} color="white"/>
                                    <Text className="text-white font-sans-bold ml-2 text-lg">Confirm Upload</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </GradientView>
    );
}

export default UploadDocument;