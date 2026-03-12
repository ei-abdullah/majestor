import React from "react";
import {View, ScrollView} from "react-native";

import {useAuthStore} from "@/src/stores/authStore";

import {useDocument} from "@/src/queries/document.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "@/src/components/screens/document/DocumentList";
import SearchBar from "@/src/components/ui/SearchBar";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import OutlineButton from "@/src/components/ui/OutlineButton";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";

import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/document";

function Document() {
    const {user} = useAuthStore();

    const [filters, setFilters] = React.useState<Filters>({
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: '',
    });

    const [appliedFilters, setAppliedFilters] = React.useState<Filters>(filters);

    let {data: documentData, isPending, error, refetch} = useDocument(user!.id, appliedFilters);

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
            <View className="flex-1 pt-8 gap-4 justify-start mx-6">
                <View className={"flex-col gap-3"}>
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
                <DocumentList
                    documents={documentData || []}
                    isPending={isPending}
                    isError={error}
                    onRefetch={refetch}
                />

                <FloatingActionButton href={"/document/upload"} icon={"plus"}/>
            </View>
        </GradientView>
    );
}

export default Document;