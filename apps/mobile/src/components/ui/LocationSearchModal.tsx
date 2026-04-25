import React from 'react';
import {Modal, View, Text, Pressable, StyleSheet} from 'react-native';
import {Ionicons, Feather} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '@/src/constants';
import * as Sentry from '@sentry/react-native';

interface LocationSearchModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    onSelect: (location: { latitude: number; longitude: number; address: string }) => void;
}

export default function LocationSearchModal({visible, title, onClose, onSelect}: LocationSearchModalProps) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}/>

                <View style={[styles.panel, {paddingBottom: insets.bottom + 16}]}>
                    <View style={styles.handle}/>

                    <View style={styles.header}>
                        <Pressable onPress={onClose} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color="#111827"/>
                        </Pressable>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <GooglePlacesAutocomplete
                            fetchDetails={true}
                            placeholder="Search for a location..."
                            debounce={200}
                            enablePoweredByContainer={false}
                            listViewDisplayed="auto"
                            keyboardShouldPersistTaps="always"
                            GooglePlacesDetailsQuery={{fields: 'geometry'}}
                            onPress={(data, details = null) => {
                                if (details?.geometry?.location) {
                                    onSelect({
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        address: data.description,
                                    });
                                    onClose();
                                } else {
                                    Sentry.captureMessage('Google Places: No geometry details available');
                                }
                            }}
                            onFail={(error) => Sentry.captureException(error)}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                                components: 'country:pk',
                            }}
                            renderLeftButton={() => (
                                <View style={{justifyContent: 'center'}}>
                                    <Feather name="search" size={18} color="#9CA3AF"/>
                                </View>
                            )}
                            textInputProps={{
                                placeholderTextColor: '#9CA3AF',
                                autoFocus: true,
                            }}
                            styles={{
                                container: {flex: 1},
                                textInputContainer: {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    backgroundColor: 'white',
                                    height: 54,
                                    paddingHorizontal: 16,
                                    gap: 12,
                                    elevation: 1,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                },
                                textInput: {
                                    backgroundColor: 'transparent',
                                    fontSize: 16,
                                    color: '#111827',
                                    flex: 1,
                                    height: '100%',
                                    padding: 0,
                                    margin: 0,
                                },
                                listView: {
                                    marginTop: 8,
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                },
                                row: {
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    height: 60,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                },
                                separator: {
                                    height: 1,
                                    backgroundColor: '#f3f4f6',
                                },
                                description: {
                                    fontSize: 15,
                                    color: '#111827',
                                },
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    panel: {
        height: '82%',
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#d1d5db',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    title: {
        fontSize: 17,
        fontFamily: 'Inter_600SemiBold',
        color: '#111827',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        flex: 1,
    },
});
