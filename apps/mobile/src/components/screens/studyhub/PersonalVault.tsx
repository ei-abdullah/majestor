import React from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import {useUserDetails} from "@/src/queries/user.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import Card from "@/src/components/ui/Card";
import SearchBar from "@/src/components/ui/SearchBar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import OutlineButton from "@/src/components/ui/OutlineButton";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";
import {Feather} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/studyHub";

export default function PersonalVault() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    
    // Sync user storage data
    useUserDetails(user!.id);

    const [filters, setFilters] = React.useState<Filters>({
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: '',
    });

    const [appliedFilters, setAppliedFilters] = React.useState<Filters>(filters);

    const {data: documents, isPending, error, refetch} = useVault(user!.id, 'PERSONAL_VAULT', appliedFilters);

    const storageUsedMB = (user?.storageUsed || 0) / (1024 * 1024);
    const storageLimitMB = (user?.storageLimit || 104857600) / (1024 * 1024);
    const usagePercentage = Math.min((storageUsedMB / storageLimitMB) * 100, 100);

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
                            {/* Storage Status Section */}
                            <View className="mb-8">
                                <View className="flex-row justify-between items-start mb-5">
                                    <View>
                                        <Text className="text-mj-text-secondary text-[10px] font-sans-extrabold uppercase tracking-widest">Storage Status</Text>
                                        <Text className="text-mj-text-main font-sans-bold text-3xl mt-1">
                                            {usagePercentage.toFixed(0)}%
                                        </Text>
                                    </View>
                                    <View className="bg-mj-blue-50 p-4 rounded-2xl shadow-sm border border-mj-blue-100">
                                        <Feather name="database" size={24} color="#3A6FF8" />
                                    </View>
                                </View>
                                
                                <View className="h-3 bg-mj-bg-blue rounded-full overflow-hidden border border-mj-bg-blue shadow-inner">
                                    <View 
                                        className="h-full bg-mj-blue rounded-full" 
                                        style={{ width: `${usagePercentage}%` }} 
                                    />
                                </View>
                                
                                <View className="flex-row justify-between mt-4">
                                    <Text className="text-mj-text-secondary text-xs font-sans-bold">
                                        {storageUsedMB.toFixed(1)} MB <Text className="font-sans-medium opacity-50">Used</Text>
                                    </Text>
                                    <Text className="text-mj-text-secondary text-xs font-sans-bold">
                                        {storageLimitMB.toFixed(0)} MB <Text className="font-sans-medium opacity-50">Limit</Text>
                                    </Text>
                                </View>
                            </View>

                            <View className="h-px bg-mj-blue-100/50 w-full mb-8" />

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
                bottom: 130,
                left: 30,
                zIndex: 1000
            }}>
                <FloatingActionButton 
                    href={{
                        pathname: "/(tabs)/studyhub/uploadDocument" as any,
                        params: { destination: 'PERSONAL_VAULT' }
                    }} 
                    icon={"file-text"}
                />
            </View>
        </GradientView>
    );
}
