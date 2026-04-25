import React, {useState, useEffect, useCallback, useMemo} from "react";
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator} from "react-native";
import {BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {Feather} from "@expo/vector-icons";
import {useUserSearch, useSendInvite} from "@/src/queries/studyhub.queries";
import {UserSearchResult} from "@/src/types/studyHub";

interface Props {
    groupId: number;
    inviterId: number;
    ref: React.RefObject<BottomSheetModal | null>;
}

function InviteModal({groupId, inviterId, ref}: Props) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const snapPoints = useMemo(() => ["65%", "80%"], []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 350);
        return () => clearTimeout(timer);
    }, [query]);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5}/>,
        []
    );

    const handleDismiss = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
    }, []);

    const {data: results, isFetching} = useUserSearch(debouncedQuery, inviterId);
    const {mutate: sendInvite, isPending: isSending} = useSendInvite();

    const handleInvite = (user: UserSearchResult) => {
        sendInvite({groupId, inviterId, inviteeId: user.id});
    };

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{backgroundColor: '#FFFFFF', borderRadius: 40}}
            handleIndicatorStyle={{backgroundColor: '#E6ECFF', width: 60}}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            onDismiss={handleDismiss}
        >
            <BottomSheetView style={{flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40}}>
                <Text style={{color: '#3A6FF8', fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4}}>
                    Members
                </Text>
                <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 22, letterSpacing: -0.5, marginBottom: 20}}>
                    Invite to Group
                </Text>

                {/* Search input */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F5F7FF',
                    borderRadius: 18,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    borderWidth: 1.5,
                    borderColor: '#EEF3FF',
                    marginBottom: 16,
                }}>
                    <Feather name="mail" size={16} color="#9CA3AF" style={{marginRight: 10}}/>
                    <BottomSheetTextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search by university email..."
                        placeholderTextColor="#9CA3AF"
                        style={{flex: 1, fontSize: 14, color: '#1A2340'}}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    {isFetching && <ActivityIndicator size="small" color="#3A6FF8"/>}
                </View>

                {/* Results */}
                {debouncedQuery.length < 2 ? (
                    <View style={{alignItems: 'center', paddingVertical: 40, opacity: 0.35}}>
                        <Feather name="mail" size={38} color="#5A6275"/>
                        <Text style={{color: '#5A6275', fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 12}}>
                            Type part of their university email
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={results ?? []}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={
                            !isFetching ? (
                                <View style={{alignItems: 'center', paddingVertical: 40, opacity: 0.35}}>
                                    <Feather name="user-x" size={38} color="#5A6275"/>
                                    <Text style={{color: '#5A6275', fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 12}}>
                                        No users found
                                    </Text>
                                </View>
                            ) : null
                        }
                        renderItem={({item}) => (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 13,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F0F4FF',
                            }}>
                                <View style={{
                                    width: 42, height: 42, borderRadius: 14,
                                    backgroundColor: '#EEF3FF',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginRight: 12, borderWidth: 1, borderColor: '#C7D7FD',
                                }}>
                                    <Text style={{color: '#3A6FF8', fontFamily: 'Inter_800ExtraBold', fontSize: 17}}>
                                        {item.username.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={{flex: 1, color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14}}>
                                    {item.username}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleInvite(item)}
                                    disabled={isSending}
                                    style={{
                                        backgroundColor: '#3A6FF8',
                                        paddingHorizontal: 18,
                                        paddingVertical: 9,
                                        borderRadius: 14,
                                    }}
                                >
                                    <Text style={{color: 'white', fontFamily: 'Inter_700Bold', fontSize: 12}}>Invite</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
}

export default InviteModal;