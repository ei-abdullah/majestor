import React from "react";
import {FlatList, RefreshControl, View, Text} from "react-native";
import DocumentCard from "@/src/components/screens/studyhub/DocumentCard";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";

interface DocumentListProps {
    documents: any[],
    isPending: boolean,
    isError: Error | null,
    onRefetch: () => void,
    searchComponent?: React.ComponentType<any> | React.ReactElement | null,
    className?: string,
    contentContainerStyle?: object,
    disableHeaderOffset?: boolean
}

function DocumentList(
    {
        documents,
        isPending,
        isError,
        onRefetch,
        searchComponent,
        className = "",
        contentContainerStyle = {},
        disableHeaderOffset = false
    }: DocumentListProps) {

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const insets = useSafeAreaInsets();
    
    // Adjusted header offset to prevent overlap with transparent header
    const headerOffset = disableHeaderOffset ? 0 : insets.top + (searchComponent ? 80 : 20);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        onRefetch();
        setIsRefreshing(false);
    };

    if (isPending && !isRefreshing) return <LoadingIndicator />

    if (isError) return <ErrorNotLoad onRefetch={handleRefresh} isRefreshing={isRefreshing}/>

    return (
        <FlatList
            data={documents}
            keyExtractor={item => item.id.toString()}
            className={className}
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
            contentContainerStyle={{
                paddingBottom: 150, 
                ...contentContainerStyle,
                paddingTop: headerOffset + ((contentContainerStyle as any).paddingTop || 0),
            }}
            ListEmptyComponent={
                !isPending ? (
                    <View className="items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-4">
                        <Feather name="file-text" size={48} color="rgba(255,255,255,0.2)" />
                        <Text className="text-white/40 font-bold mt-4">No documents found</Text>
                        <Text className="text-white/20 text-xs mt-1">Try changing your filters</Text>
                    </View>
                ) : null
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
        />
    );
}

export default DocumentList;
