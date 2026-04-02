import React from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import SearchBar from "@/src/components/ui/SearchBar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import OutlineButton from "@/src/components/ui/OutlineButton";
import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/studyHub";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";

export default function PublicVault() {
    const {user} = useAuthStore();
    const [filters, setFilters] = React.useState<Filters>({
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: ''
    });

    const [appliedFilters, setAppliedFilters] = React.useState<Filters>(filters);

    const {data: documents, isPending, error, refetch} = useVault(user!.id, 'PUBLIC_VAULT', appliedFilters);

    function handleSearchQuery(query: string) {
        setFilters({...filters, searchQuery: query});
    }

    function handleYearChange(year: string | number) {
        setFilters({...filters, year: year.toString()});
    }

    function handleTypeChange(type: string | number) {
        setFilters({...filters, docType: type.toString()});
    }

    function handleLikeFilterChange(likeFilter: string | number) {
        setFilters({...filters, sortByLikes: likeFilter.toString()});
    }

    function handleRefetchData() {
        setAppliedFilters(filters);
    }

    function handleReset() {
        const resetFilters = {
            searchQuery: '',
            year: '',
            docType: '',
            sortByLikes: '',
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
    }

    return (
        <GradientView>
            <View className="flex-1 px-6">
                <DocumentList
                    documents={documents || []}
                    isPending={isPending}
                    isError={error}
                    onRefetch={refetch}
                    disableHeaderOffset={true}
                    className="bg-white rounded-t-[40px] shadow-blue mt-28 overflow-hidden"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32 }}
                    searchComponent={
                        <View className="mb-8">
                            {/* Header Label Section */}
                            <View className="mb-8 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-mj-teal font-black text-[10px] uppercase tracking-widest">Public Vault</Text>
                                    <Text className="text-mj-text-main font-bold text-3xl mt-1">Resources</Text>
                                </View>
                                <View className="bg-mj-teal-50 p-4 rounded-2xl shadow-sm border border-mj-teal-100">
                                    <Feather name="globe" size={24} color="#6FD0C5" />
                                </View>
                            </View>

                            {/* Filters Section */}
                            <View className="flex-col gap-4">
                                <View className="flex-row items-center gap-2">
                                    <SearchBar
                                        value={filters.searchQuery}
                                        onChange={handleSearchQuery}
                                        className="flex-1 shrink bg-mj-bg-light"
                                        size="compact"
                                    />
                                    <PrimaryButton
                                        icon="search"
                                        onPress={handleRefetchData}
                                        className="w-16"
                                        disabled={isPending}
                                        size="compact"
                                    />
                                </View>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{gap: 8, paddingRight: 4}}
                                >
                                    <StyledDropDown
                                        options={type}
                                        value={filters.docType}
                                        onChange={handleTypeChange}
                                        icon="book"
                                        placeholder="Type"
                                        size="compact"
                                        className="w-36"
                                        noShadow={true}
                                    />
                                    <StyledDropDown
                                        options={years}
                                        value={filters.year}
                                        onChange={handleYearChange}
                                        icon="calendar"
                                        placeholder="Year"
                                        size="compact"
                                        className="w-36"
                                        noShadow={true}
                                    />
                                    <StyledDropDown
                                        options={filterByLike}
                                        value={filters.sortByLikes}
                                        onChange={handleLikeFilterChange}
                                        icon="heart"
                                        placeholder="Sort"
                                        size="compact"
                                        className="w-36"
                                        noShadow={true}
                                    />
                                    <OutlineButton
                                        title="Reset"
                                        onPress={handleReset}
                                        variant="destructive"
                                        size="compact"
                                        className="w-24"
                                    />
                                </ScrollView>
                            </View>
                            
                            <View className="h-px bg-mj-blue-100/50 w-full mt-8" />
                        </View>
                    }
                />
            </View>

            {/* Floating Action Button positioned above tab bar */}
            <View style={{
                position: 'absolute',
                bottom: 110,
                left: 30,
                zIndex: 1000
            }}>
                <FloatingActionButton 
                    href={{
                        pathname: "/studyhub/uploadDocument",
                        params: { destination: 'PUBLIC_VAULT' }
                    }} 
                    icon={"file-text"}
                />
            </View>
        </GradientView>
    );
}
