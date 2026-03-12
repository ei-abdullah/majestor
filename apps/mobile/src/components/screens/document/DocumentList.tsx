import React from "react";
import {FlatList, RefreshControl} from "react-native";
import DocumentCard from "@/src/components/screens/document/DocumentCard";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface DocumentListProps {
    documents: any[],
    isPending: boolean,
    isError: Error | null,
    onRefetch: () => void,
    searchComponent?: React.ComponentType<any> | React.ReactElement | null
}

function DocumentList(
    {
        documents,
        isPending,
        isError,
        onRefetch,
        searchComponent,
    }: DocumentListProps) {

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const insets = useSafeAreaInsets();
    const headerOffset = insets.top + 76;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        onRefetch();
        setIsRefreshing(false);
    };

    if (isPending && !isRefreshing) return <LoadingIndicator/>

    if (isError) return <ErrorNotLoad onRefetch={handleRefresh} isRefreshing={isRefreshing}/>

    return (
        <FlatList
            data={documents}
            keyExtractor={item => item.id.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={onRefetch}
                    tintColor="#3A6FF8"
                    colors={["#3A6FF8"]}
                    progressBackgroundColor="#fff"
                />
            }
            ListHeaderComponent={searchComponent}
            renderItem={({item}) => <DocumentCard document={item}/>}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 130, paddingTop: headerOffset}}
            contentInset={{bottom: 130}}
            automaticallyAdjustContentInsets={false}
        />
    );
}

export default DocumentList;

