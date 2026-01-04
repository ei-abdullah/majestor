import React, {useState} from "react";
import {Alert, ScrollView, Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";

import {semesterType, type, years} from "@/src/constants";

import {useAuthStore} from "@/src/stores/authStore";
import {useCourse} from "@/src/queries/course.queries";
import {useUploadDocument} from "@/src/queries/document.queries";

import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import GradientView from "@/src/components/ui/GradientView";
import ImageUpload from "@/src/components/ui/ImageUpload";
import ImageCarousel from "@/src/components/ui/ImageCarousel";
import OutlineButton from "@/src/components/ui/OutlineButton";
import StyledModalWithSearch from "@/src/components/ui/StyledModalWithSearch";
import ErrorText from "@/src/components/ui/ErrorText";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import Card from "@/src/components/ui/Card";


function UploadDocument() {
    const {user} = useAuthStore();
    const {control, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues: {
            title: '',
            documentType: undefined,
            semesterType: undefined,
            uploadedYear: new Date().getFullYear(),
            courseId: undefined,
            documentImages: []
        },
        mode: "onBlur"
    });
    const {
        mutate: uploadDocument,
        isPending: isDownloading,
        error: uploadError
    } = useUploadDocument();
    const {data: courses, isPending: loadingCourses, error: courseError} = useCourse(1);

    const [images, setImages] = useState<string[]>([]);


    function handleReset() {
        reset();
        setImages([]);
    }

    const onSubmit = async (data: any) => {
        // Validate required fields
        if (!data.documentType || !data.semesterType || !data.courseId || !data.uploadedYear) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (images.length === 0) {
            Alert.alert('Error', 'Please upload at least one image');
            return;
        }

        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('courseId', data.courseId.toString());
        formData.append('documentType', data.documentType);
        formData.append('semesterType', data.semesterType);
        formData.append('uploadedYear', data.uploadedYear.toString());

        // Append images from state (not from form data)
        images.forEach((uri, index) => {
            const imageFile = {
                uri: uri,
                name: `document_${index}.jpg`,
                type: 'image/jpeg'
            } as any;

            formData.append('documentImages', imageFile);
        });

        const userId = user!.id;
        uploadDocument({userId, formData});

        reset();
        setImages([]);
    }

    if (isDownloading || loadingCourses) return <LoadingIndicator/>

    if (courseError || uploadError) return <ErrorNotLoad/>

    return (
        <GradientView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 24}}
                >
                    <View className={"mx-6 mt-6"}>
                        {/* Image Upload Section */}
                        <Card className={"px-4 py-6"}>
                            <Text className={"text-base font-semibold text-gray-700 mb-3"}>Document Images</Text>
                            {images.length > 0 ? (
                                <ImageCarousel
                                    images={images}
                                    onImagesChange={setImages}
                                    height={280}
                                />
                            ) : (
                                <ImageUpload
                                    onImagesChange={setImages}
                                />
                            )}
                        </Card>

                        {/* Document Details Section */}
                        <Card className={"px-4 py-6 mt-4"}>
                            <Text className={"text-base font-semibold text-gray-700 mb-4"}>Document Details</Text>

                            {/* Document Title */}
                            <View className={"flex flex-col gap-2 mb-5"}>
                                <View className={"flex flex-row justify-between items-center"}>
                                    <Text className={"text-sm font-medium text-gray-600"}>Title *</Text>
                                    {
                                        errors.title &&
                                        <ErrorText message={errors.title.message!}/>
                                    }
                                </View>
                                <Controller
                                    control={control}
                                    name="title"
                                    rules={{
                                        required: {value: true, message: "Required"},
                                        minLength: {value: 3, message: "Title must be at least 3 characters long"},
                                        maxLength: {value: 100, message: "Title cannot exceed 100 characters"}
                                    }}
                                    render={({field: {onChange, value}}) => (
                                        <StyledTextInput
                                            value={value}
                                            placeholder={"Enter document title"}
                                            icon="edit"
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                            </View>

                            {/* Courses */}
                            <View className={"flex flex-col gap-2 mb-5"}>
                                <View className={"flex flex-row justify-between items-center"}>
                                    <Text className={"text-sm font-medium text-gray-600"}>Course *</Text>
                                    {
                                        errors.courseId &&
                                        <ErrorText message={errors.courseId.message!}/>

                                    }
                                </View>
                                <Controller
                                    control={control}
                                    name="courseId"
                                    rules={{
                                        required: {value: true, message: "Required"},
                                    }}
                                    render={({field: {onChange, value}}) => (
                                        <StyledModalWithSearch
                                            value={value}
                                            onChange={onChange}
                                            options={courses?.data.courses || []}
                                            placeholder={"Select course"}
                                            icon={"book"}
                                            label={"Courses"}
                                        />
                                    )}
                                />
                            </View>

                            {/* Document Type */}
                            <View className={"flex flex-col gap-2 mb-5"}>
                                <View className={"flex flex-row justify-between items-center"}>
                                    <Text className={"text-sm font-medium text-gray-600"}>Document Type *</Text>
                                    {
                                        errors.documentType &&
                                        <ErrorText message={errors.documentType.message!}/>
                                    }
                                </View>
                                <Controller
                                    control={control}
                                    name="documentType"
                                    rules={{
                                        required: {value: true, message: "Required"},
                                    }}
                                    render={({field: {onChange, value}}) => (
                                        <StyledDropDown
                                            value={value}
                                            onChange={onChange}
                                            options={type || []}
                                            placeholder={"Select document type"}
                                            icon={"file-text"}
                                        />
                                    )}
                                />
                            </View>

                            {/* Semester & Year Row */}
                            <View className={"flex-row gap-3 mb-5"}>
                                {/* Semester Type */}
                                <View className={"flex flex-col gap-2 flex-1"}>
                                    <View className={"flex flex-row justify-between items-center"}>
                                        <Text className={"text-sm font-medium text-gray-600"}>Semester *</Text>
                                        {
                                            errors.semesterType &&
                                            <ErrorText message={errors.semesterType.message!}/>
                                        }
                                    </View>
                                    <Controller
                                        control={control}
                                        name="semesterType"
                                        rules={{
                                            required: {value: true, message: "Required"},
                                        }}
                                        render={({field: {onChange, value}}) => (
                                            <StyledDropDown
                                                value={value}
                                                onChange={onChange}
                                                options={semesterType || []}
                                                placeholder={"Semester"}
                                                icon={"calendar"}
                                            />
                                        )}
                                    />
                                </View>

                                {/* Year Type */}
                                <View className={"flex flex-col gap-2 flex-1"}>
                                    <View className={"flex flex-row justify-between items-center"}>
                                        <Text className={"text-sm font-medium text-gray-600"}>Year *</Text>
                                        {
                                            errors.uploadedYear &&
                                            <ErrorText message={errors.uploadedYear.message!}/>
                                        }
                                    </View>
                                    <Controller
                                        control={control}
                                        name="uploadedYear"
                                        rules={{
                                            required: {value: true, message: "Required"},
                                        }}
                                        render={({field: {onChange, value}}) => (
                                            <StyledDropDown
                                                value={value}
                                                onChange={onChange}
                                                options={years}
                                                placeholder={"Year"}
                                                icon={"calendar"}
                                            />
                                        )}
                                    />
                                </View>
                            </View>

                            {/* Faculty (immutable) */}
                            <View className={"flex flex-col gap-2"}>
                                <Text className={"text-sm font-medium text-gray-600"}>Faculty</Text>
                                <StyledTextInput
                                    value={courses!.data.facultyName}
                                    placeholder={"Faculty"}
                                    icon="home"
                                    onChangeText={() => {
                                    }}
                                    disabled={true}
                                />
                            </View>
                            {/* Reset Button */}
                            <View className={"mt-6"}>
                                <OutlineButton
                                    title={"Reset"}
                                    variant={"destructive"}
                                    onPress={handleReset}
                                />
                            </View>
                        </Card>


                        {/* Submit Button */}
                        <View className={"mt-6 mb-4"}>
                            <PrimaryButton
                                title={loadingCourses ? "Loading..." : ""}
                                icon="upload"
                                iconSize={22}
                                className={"w-full"}
                                disabled={loadingCourses || isDownloading}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>
                </ScrollView>
        </GradientView>
    );
}

export default UploadDocument;