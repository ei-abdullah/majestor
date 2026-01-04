import React from "react";
import {FlatList, RefreshControl} from "react-native";
import DocumentCard from "@/src/components/screens/document/DocumentCard";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";

type DocumentListProps = {
    documents: any[];
    isPending: boolean;
    isError: Error | null;
    onRefetch: () => void;
};

function DocumentList(
    {
        documents,
        isPending,
        isError,
        onRefetch,
    }: DocumentListProps) {

    const [isRefreshing, setIsRefreshing] = React.useState(false);

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
            renderItem={({item}) => <DocumentCard document={item}/>}
            showsVerticalScrollIndicator={false}
        />
    );
}

export default DocumentList;

