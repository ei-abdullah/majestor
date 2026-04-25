import React, {useState} from "react";
import {View} from "react-native";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Feather} from "@expo/vector-icons";
import {GOOGLE_API_KEY} from "@/src/constants";
import * as Sentry from "@sentry/react-native";

const googlePlacesApiKey = GOOGLE_API_KEY;

type GoogleInputProps = {
    placeholderString?: string;
    icon?: keyof typeof Feather.glyphMap;
    initialLocation?: string;
    containerStyle?: string;
    autoFocus?: boolean;
    handlePress: (location: { latitude: number, longitude: number, address: string }) => void;
}

function GoogleTextInput(
    {
        placeholderString,
        icon,
        initialLocation,
        containerStyle,
        autoFocus,
        handlePress
    }: GoogleInputProps) {
    const [focused, setFocused] = useState(false);


    return <View
        className={`relative ${containerStyle}`}>
        <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder={"Search"}
            debounce={200}
            enablePoweredByContainer={false}
            GooglePlacesDetailsQuery={{
                fields: 'geometry',
            }}
            onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                    handlePress({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: data.description,
                    });
                } else {
                    Sentry.captureMessage('Google Places: No geometry details available');
                }
            }}
            onFail={(error) => Sentry.captureException(error)}
            query={{
                key: googlePlacesApiKey,
                language: 'en',
                components: 'country:pk',
            }}
            renderLeftButton={() => (
                <View className={"self-center"}>
                    <Feather
                        name={icon ? icon : "search"}
                        size={18}
                        color={focused ? "#4CB8AD" : "#9ca3af"}
                    />
                </View>
            )}
            textInputProps={{
                placeholderTextColor: '#9CA3AF',
                placeholder: initialLocation ?? placeholderString ?? "Where do you want to go?",
                autoFocus: autoFocus,
                onFocus: () => {
                    setFocused(true);
                },
                onBlur: () => {
                    setFocused(false);
                },
            }}
            styles={{
                textInputContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: focused ? '#9ca3af' : '#f9fafb',
                    backgroundColor: 'white',
                    height: 70,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    elevation: focused ? 4 : 1,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: focused ? 0.3 : 0.05,
                    shadowRadius: focused ? 12 : 2,
                },
                textInput: {
                    backgroundColor: 'transparent',
                    fontSize: 16,
                    fontFamily: 'Inter_400Regular',
                    color: '#111827',
                    flex: 1,
                    height: '100%',
                    marginLeft: 12,
                    padding: 0,
                    margin: 0,
                },
                listView: {
                    backgroundColor: 'white',
                    position: "absolute",
                    top: 75,
                    left: 0,
                    right: 0,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#f9fafb',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    zIndex: 999,
                    maxHeight: 300,
                },
                row: {
                    padding: 13,
                    height: 60,
                    flexDirection: 'row',
                },
                separator: {
                    height: 1,
                    backgroundColor: '#f3f4f6',
                },
                description: {
                    fontSize: 14,
                    color: '#111827',
                }
            }}
        />

    </View>
}

export default GoogleTextInput;