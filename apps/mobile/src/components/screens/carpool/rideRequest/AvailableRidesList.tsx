import React from "react";
import {FlatList, RefreshControl} from "react-native";
import {RecentRideResponse} from "@/src/types/ride";
import AvailableRidesCard from "@/src/components/ui/AvailableRidesCard";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import EmptyState from "@/src/components/ui/EmptyState";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface AvailableRidesListProps {
    rides: RecentRideResponse[];
    rideDistance: number;
    isPending: boolean;
    isError: boolean;
    onRefetch: () => void;
    header: React.ReactElement;
    onRidePress: (ride: RecentRideResponse) => void;
}

function AvailableRidesList(
    {
        rides,
        rideDistance,
        isPending,
        isError,
        onRefetch,
        header,
        onRidePress,
    }: AvailableRidesListProps) {

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const insets = useSafeAreaInsets();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        onRefetch();
        setIsRefreshing(false);
    };

    if (isPending && !isRefreshing) return <LoadingIndicator/>;

    if (isError) return <ErrorNotLoad onRefetch={handleRefresh} isRefreshing={isRefreshing}/>;

    return (
        <FlatList<RecentRideResponse>
            className="mx-5"
            data={rides}
            keyExtractor={(item) => String(item.id)}
            ListHeaderComponent={header}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor="#3A6FF8"
                    colors={["#3A6FF8"]}
                    progressBackgroundColor="#fff"
                />
            }
            ListEmptyComponent={
                <EmptyState
                    message="No rides available"
                    submessage="No rides available right now."
                />
            }
            renderItem={({item}) => (
                <AvailableRidesCard
                    recentRide={item}
                    rideDistance={rideDistance}
                    className="mb-4"
                    onPress={() => onRidePress(item)}
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingTop: insets.top + 76, paddingBottom: 130}}
        />
    );
}

export default AvailableRidesList;

