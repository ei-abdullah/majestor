import React from "react";
import {View} from "react-native";

import {Filters} from "@/src/services/document.api";
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
                <View className={"flex-col gap-4"}>
                    {/*  Search bar and filters  */}
                    <View className={"flex-row items-stretch justify-between gap-2 h-16"}>
                        <SearchBar
                            value={filters!.searchQuery}
                            onChange={handleSearchQuery}
                            className={"w-3/4 flex-[2]"}
                            size={"compact"}
                        />
                        <PrimaryButton
                            icon={"search"}
                            onPress={handleRefetchData}
                            className={"w-1/5 flex-[1]"}
                            disabled={isPending}
                            size={"compact"}
                        />
                    </View>
                    <View className={"flex-row items-center justify-center gap-2 h-32"}>
                        <View className={"flex-1 gap-2"}>
                            <StyledDropDown
                                options={type}
                                value={filters.docType}
                                onChange={handleTypeChange}
                                icon={"book"}
                                className={"h-16"}
                                size={"compact"}
                            />
                            <StyledDropDown
                                options={years}
                                value={filters.year}
                                onChange={handleYearChange}
                                icon={"calendar"}
                                className={"h-16"}
                                size={"compact"}
                            />
                        </View>
                        <View className={"flex-1 gap-2"}>
                            <StyledDropDown
                                options={filterByLike}
                                value={filters.sortByLikes}
                                onChange={handleLikeFilterChange}
                                icon={"heart"}
                                className={"h-16"}
                                size={"compact"}
                            />
                            <OutlineButton
                                title={"Reset filters"}
                                onPress={handleReset}
                                variant={"destructive"}
                                className={""}
                                size={"compact"}
                            />
                        </View>
                    </View>
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