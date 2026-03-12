import React from "react";
import {FlatList, RefreshControl} from "react-native";

import {GetBookingsResponse} from "@/src/types/booking";
import BookingRequestCard from "@/src/components/ui/BookingRequestCard";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import ErrorNotLoad from "@/src/components/ui/ErrorNotLoad";
import EmptyState from "@/src/components/ui/EmptyState";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface BookingRequestsListProps {
    bookings: GetBookingsResponse[];
    rideDistanceKm: number;
    isPending: boolean;
    isError: boolean;
    onRefetch: () => void;
    header: React.ReactElement;
    onBookingPress?: (booking: GetBookingsResponse) => void;
}

function BookingRequestsList(
    {
        bookings,
        rideDistanceKm,
        isPending,
        isError,
        onRefetch,
        header,
        onBookingPress,
    }: BookingRequestsListProps) {

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
        <FlatList<GetBookingsResponse>
            className="mx-5"
            data={bookings}
            keyExtractor={(item) => String(item.bookingId)}
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
                    message="No booking requests"
                    submessage="No one has booked your ride yet."
                />
            }
            renderItem={({item}) => (
                <BookingRequestCard
                    booking={item}
                    rideDistanceKm={rideDistanceKm}
                    className="mb-4"
                    onPress={() => onBookingPress?.(item)}
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingTop: insets.top + 76, paddingBottom: 40}}
        />
    );
}

export default BookingRequestsList;

