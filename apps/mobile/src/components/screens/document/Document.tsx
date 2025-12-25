import React from "react";
import {FlatList, RefreshControl} from "react-native";
import {useDocument} from "@/src/queries/document.queries";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ErrorNotLoad";
import GradientView from "@/src/components/GradientView";
import {SafeAreaView} from "react-native-safe-area-context";
import DocumentCard from "@/src/components/screens/document/DocumentCard";

function Document() {
    const {data: documentData, isPending, error, refetch} = useDocument("1", {});

    if (isPending) return <LoadingIndicator/>

    if (error) return <ErrorNotLoad/>

    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 justify-start">
                <FlatList
                    data={documentData}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                    <RefreshControl
                        refreshing={isPending}
                        onRefresh={refetch}
                        tintColor="#3A6FF8"
                        colors={["#3A6FF8"]}
                        progressBackgroundColor="#fff"
                    />
                }
                    renderItem={({item}) => <DocumentCard document={item}/>}
                    showsVerticalScrollIndicator={false}

                />
            </SafeAreaView>
        </GradientView>
    );
}

export default Document;