import React from "react";
import {View, ScrollView} from "react-native";

import {useAuthStore} from "@/src/stores/authStore";

import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "@/src/components/screens/studyhub/DocumentList";
import SearchBar from "@/src/components/ui/SearchBar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import OutlineButton from "@/src/components/ui/OutlineButton";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";

import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/studyHub";

function Document() {
    const {user} = useAuthStore();

    const [filters, setFilters] = React.useState<Filters>({
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: '',
    });

    const [appliedFilters, setAppliedFilters] = React.useState<Filters>(filters);

    //TODO: Input document destination from input instead of hardcode
    let {data: documentData, isPending, error, refetch} = useVault(user!.id, 'PERSONAL_VAULT', appliedFilters);

    function handleSearchQuery(query: string) {
        setFilters({
            ...filters,
            searchQuery: query
        });
    }

    function handleYearChange(year: string | number) {
        setFilters({
            ...filters,
            year: year.toString()
        });
    }

    function handleTypeChange(type: string | number) {
        setFilters({
            ...filters,
            docType: type.toString()
        });
    }

    function handleLikeFilterChange(likeFilter: string | number) {
        setFilters({
            ...filters,
            sortByLikes: likeFilter.toString()
        });
    }

    function handleRefetchData() {
        if (appliedFilters === null) return;
        setAppliedFilters(filters);
    }

    function handleReset() {
        const resetFilters = {
            courseTitle: '',
            year: '',
            docType: '',
            sortByLikes: '',
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
    }

    return (
        <GradientView>
            <View className="flex-1 mx-6">
                <DocumentList
                    documents={documentData || []}
                    isPending={isPending}
                    isError={error}
                    onRefetch={refetch}
                    searchComponent={
                        <View className={"flex-col gap-3 mb-4"}>
                            {/* Search bar + search button */}
                            <View className={"flex-row items-center gap-2"}>
                                <SearchBar
                                    value={filters!.searchQuery}
                                    onChange={handleSearchQuery}
                                    className={"flex-1 shrink"}
                                    size={"compact"}
                                />
                                <PrimaryButton
                                    icon={"search"}
                                    onPress={handleRefetchData}
                                    className={"w-16"}
                                    disabled={isPending}
                                    size={"compact"}
                                />
                            </View>

                            {/* Filter chips — horizontal scroll */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{gap: 8, paddingRight: 4}}
                            >
                                <StyledDropDown
                                    options={type}
                                    value={filters.docType}
                                    onChange={handleTypeChange}
                                    icon={"book"}
                                    placeholder={"Type"}
                                    size={"compact"}
                                    className={"w-36"}
                                />
                                <StyledDropDown
                                    options={years}
                                    value={filters.year}
                                    onChange={handleYearChange}
                                    icon={"calendar"}
                                    placeholder={"Year"}
                                    size={"compact"}
                                    className={"w-36"}
                                />
                                <StyledDropDown
                                    options={filterByLike}
                                    value={filters.sortByLikes}
                                    onChange={handleLikeFilterChange}
                                    icon={"heart"}
                                    placeholder={"Sort"}
                                    size={"compact"}
                                    className={"w-36"}
                                />
                                <OutlineButton
                                    title={"Reset"}
                                    onPress={handleReset}
                                    variant={"destructive"}
                                    size={"compact"}
                                    className={"w-24"}
                                />
                            </ScrollView>
                        </View>
                    }
                />
            </View>
            
            {/* Floating Action Button positioned above tab bar - PERFECT POSITION */}
            <View style={{
                position: 'absolute', 
                bottom: 110,
                left: 30,
                zIndex: 1000
            }}>
                <FloatingActionButton href={"/studyhub/uploadDocument"} icon={"plus"}/>
            </View>
        </GradientView>
    );
}

export default Document;