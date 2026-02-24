import React, {useRef, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import CustomMarker from "./CustomMarker";

type Location = {
    latitude: number;
    longitude: number;
    address?: string;
};

type Props = {
    // Poster's route (driver)
    posterStart: Location;
    posterEnd: Location;

    // Booker's locations (passenger)
    bookerPickup?: Location;
    bookerDropoff?: Location;

    // Display options
    showDirections?: boolean;
    showLegend?: boolean;
    className?: string;
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY|| "";

function RouteMapWithDeviation({
    posterStart,
    posterEnd,
    bookerPickup,
    bookerDropoff,
    showDirections = true,
    showLegend = true,
    className = "",
}: Props) {
    const mapRef = useRef<MapView>(null);

    // Fit map to show all markers when component mounts or locations change
    useEffect(() => {
        if (mapRef.current) {
            const coordinates = [posterStart, posterEnd];
            if (bookerPickup) coordinates.push(bookerPickup);
            if (bookerDropoff) coordinates.push(bookerDropoff);

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                animated: true,
            });
        }
    }, [posterStart, posterEnd, bookerPickup, bookerDropoff]);

    return (
        <View className={`relative ${className}`}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: posterStart.latitude,
                    longitude: posterStart.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {/* Poster's Route (Driver) */}
                {showDirections && API_KEY ? (
                    <MapViewDirections
                        origin={posterStart}
                        destination={posterEnd}
                        apikey={API_KEY}
                        strokeWidth={4}
                        strokeColor="#3A6FF8"
                        optimizeWaypoints={false}
                    />
                ) : (
                    <Polyline
                        coordinates={[posterStart, posterEnd]}
                        strokeWidth={4}
                        strokeColor="#3A6FF8"
                        lineDashPattern={[1, 10]}
                    />
                )}

                {/* Poster's Start Marker (Blue) */}
                <Marker coordinate={posterStart}>
                    <CustomMarker color="#3A6FF8" icon="location-sharp" label="Start" />
                </Marker>

                {/* Poster's End Marker (Red) */}
                <Marker coordinate={posterEnd}>
                    <CustomMarker color="#EF4444" icon="flag" label="End" />
                </Marker>

                {/* Booker's Pickup (Green) */}
                {bookerPickup && (
                    <Marker coordinate={bookerPickup}>
                        <CustomMarker color="#22C55E" icon="enter" label="Pickup" />
                    </Marker>
                )}

                {/* Booker's Dropoff (Orange) */}
                {bookerDropoff && (
                    <Marker coordinate={bookerDropoff}>
                        <CustomMarker color="#F97316" icon="exit" label="Dropoff" />
                    </Marker>
                )}

                {/* Route with booker's stops (if provided) */}
                {showDirections && API_KEY && bookerPickup && bookerDropoff && (
                    <MapViewDirections
                        origin={posterStart}
                        destination={posterEnd}
                        waypoints={[bookerPickup, bookerDropoff]}
                        apikey={API_KEY}
                        strokeWidth={3}
                        strokeColor="#8DDDD3"
                        optimizeWaypoints={false}
                    />
                )}
            </MapView>

            {/* Legend */}
            {showLegend && (
                <View className="absolute bottom-4 left-4 bg-white/95 rounded-lg p-3 shadow-lg">
                    <View className="flex-row items-center mb-1">
                        <View className="w-6 h-1 bg-mj-blue mr-2" />
                        <Text className="text-xs text-mj-text-secondary">
                            Driver route
                        </Text>
                    </View>
                    {bookerPickup && bookerDropoff && (
                        <View className="flex-row items-center">
                            <View className="w-6 h-1 bg-mj-teal-light mr-2" style={{borderStyle: 'dashed'}} />
                            <Text className="text-xs text-mj-text-secondary">
                                With pickup
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
});

export default RouteMapWithDeviation;

