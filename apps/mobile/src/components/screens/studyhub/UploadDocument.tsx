import React, {useState} from "react";
import {ScrollView, Text, View, TouchableOpacity} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {router} from "expo-router";
import {Feather} from "@expo/vector-icons";

import {semesterType, type, years} from "@/src/constants";
import {useAuthStore} from "@/src/stores/authStore";
import {useCourse} from "@/src/queries/course.queries";
import {useUploadDocument} from "@/src/queries/studyhub.queries";

import GradientView from "@/src/components/ui/GradientView";
import ImageUpload from "@/src/components/ui/ImageUpload";
import ImageCarousel from "@/src/components/ui/ImageCarousel";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import ErrorText from "@/src/components/ui/ErrorText";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import Card from "@/src/components/ui/Card";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const DESTINATIONS = [
    { label: "Private Vault", value: "PERSONAL_VAULT", icon: "lock" },
    { label: "Open Vault", value: "PUBLIC_VAULT", icon: "globe" },
    { label: "Study Group", value: "STUDY_GROUP", icon: "users" }
];

function UploadDocument() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {control, handleSubmit, reset, watch, formState: {errors}} = useForm({
        defaultValues: {
            title: '',
            documentType: undefined,
            semesterType: undefined,
            uploadedYear: new Date().getFullYear(),
            courseId: undefined,
            destination: 'PERSONAL_VAULT',
            isPremiumOnly: true
        },
        mode: "onBlur"
    });

    const [images, setImages] = useState<string[]>([]);
    const selectedDestination = watch("destination");

    function handleReset() {
        reset();
        setImages([]);
    }

    const {
        mutate: uploadDocument,
        isPending: isUploading
    } = useUploadDocument(handleReset);

    const {data: courses, isPending: loadingCourses} = useCourse(user!.id);

    const onSubmit = async (data: any) => {
        if (images.length === 0) return;

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('documentType', data.documentType);
        formData.append('semesterType', data.semesterType);
        formData.append('uploadedYear', data.uploadedYear.toString());
        formData.append('destination', data.destination);
        formData.append('isPremiumOnly', data.isPremiumOnly.toString());
        
        if (data.courseId) formData.append('courseId', data.courseId.toString());

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

    if(loadingCourses) return <LoadingIndicator />;

    return (
        <GradientView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 140, paddingTop: insets.top + 20}}
            >
                <View className="mx-6">
                    <View className="flex-row items-center mb-8">
                        <TouchableOpacity 
                            onPress={() => router.back()} 
                            className="bg-white/10 p-3 rounded-2xl border border-white/10 mr-4"
                        >
                            <Feather name="arrow-left" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold text-white">Upload</Text>
                    </View>

                    {/* Step 1: Destination Selection */}
                    <View className="mb-6 flex-row gap-2">
                        {DESTINATIONS.map((dest) => (
                            <Controller
                                key={dest.value}
                                control={control}
                                name="destination"
                                render={({field: {onChange, value}}) => (
                                    <TouchableOpacity 
                                        onPress={() => onChange(dest.value)}
                                        className={`flex-1 p-3 rounded-2xl items-center border ${value === dest.value ? 'bg-white border-white shadow-blue' : 'bg-white/10 border-white/10'}`}
                                    >
                                        <Feather name={dest.icon as any} size={18} color={value === dest.value ? "#3A6FF8" : "white"} />
                                        <Text className={`text-[8px] font-black uppercase mt-1 ${value === dest.value ? 'text-mj-blue' : 'text-white/60'}`}>
                                            {dest.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ))}
                    </View>

                    {/* Step 2: Image Selection */}
                    <Card className="p-4 bg-white rounded-3xl shadow-blue border-0 mb-6">
                        <Text className="text-mj-text-secondary text-[10px] font-bold uppercase tracking-wider mb-4 px-2">Document Images</Text>
                        {images.length > 0 ? (
                            <ImageCarousel images={images} onImagesChange={setImages} height={250} />
                        ) : (
                            <ImageUpload onImagesChange={setImages} />
                        )}
                    </Card>

                    {/* Step 3: Metadata */}
                    <Card className="p-6 bg-white rounded-3xl shadow-blue border-0">
                        <Text className="text-mj-text-secondary text-[10px] font-bold uppercase tracking-wider mb-6">Document Details</Text>

                        {/* Title */}
                        <View className="mb-6">
                            <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Title</Text>
                            <Controller
                                control={control}
                                name="title"
                                rules={{required: true}}
                                render={({field: {onChange, value}}) => (
                                    <StyledTextInput value={value} placeholder="e.g. Final Exam Prep" onChangeText={onChange} className="bg-mj-bg-light rounded-2xl" />
                                )}
                            />
                        </View>

                        {/* Course (Optional for Personal) */}
                        <View className="mb-6">
                            <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Course {selectedDestination === 'PERSONAL_VAULT' ? '(Optional)' : '*'}</Text>
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

                        {/* Type & Semester Row */}
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Type</Text>
                                <Controller
                                    control={control}
                                    name="documentType"
                                    rules={{required: true}}
                                    render={({field: {onChange, value}}) => (
                                        <StyledDropDown options={type} value={value} onChange={onChange} size="compact" className="bg-mj-bg-light rounded-2xl" />
                                    )}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-mj-text-main text-sm font-bold mb-2 ml-1">Semester</Text>
                                <Controller
                                    control={control}
                                    name="semesterType"
                                    rules={{required: true}}
                                    render={({field: {onChange, value}}) => (
                                        <StyledDropDown options={semesterType} value={value} onChange={onChange} size="compact" className="bg-mj-bg-light rounded-2xl" />
                                    )}
                                />
                            </View>
                        </View>

                        {/* Premium Checkbox */}
                        <View className="flex-row items-center justify-between bg-mj-blue-50 p-4 rounded-2xl border border-mj-blue-100">
                            <View className="flex-1 mr-4">
                                <Text className="text-mj-blue-900 font-bold text-sm">Premium Content</Text>
                                <Text className="text-mj-blue-700 text-[10px]">Restricts access to Elite members only.</Text>
                            </View>
                            <Controller
                                control={control}
                                name="isPremiumOnly"
                                render={({field: {onChange, value}}) => (
                                    <TouchableOpacity 
                                        onPress={() => onChange(!value)}
                                        className={`w-10 h-10 rounded-xl items-center justify-center ${value ? 'bg-mj-blue shadow-blue' : 'bg-white border border-mj-blue-200'}`}
                                    >
                                        <Feather name={value ? "check" : "square"} size={20} color={value ? "white" : "#A3BFFF"} />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Card>

                    {/* Action Buttons */}
                    <View className="mt-8 flex-row gap-4">
                        <TouchableOpacity 
                            onPress={handleReset}
                            className="flex-1 py-5 rounded-3xl bg-mj-bg-light items-center justify-center border border-mj-bg-blue"
                        >
                            <Text className="text-mj-text-secondary font-bold">Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleSubmit(onSubmit)}
                            disabled={isUploading}
                            className="flex-[2] py-5 rounded-3xl bg-mj-blue-600 items-center justify-center shadow-blue"
                        >
                            {isUploading ? (
                                <LoadingIndicator />
                            ) : (
                                <View className="flex-row items-center">
                                    <Feather name="upload-cloud" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2 text-lg">Confirm Upload</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </GradientView>
    );
}

export default UploadDocument;
