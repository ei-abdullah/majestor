import React from "react";
import {View, Text, ScrollView} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import SearchBar from "@/src/components/ui/SearchBar";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/studyHub";

export default function PublicVault() {
    const {user} = useAuthStore();
    const [filters, setFilters] = React.useState<Filters>({
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: ''
    });

    const {data: documents, isPending, error, refetch} = useVault(user!.id, 'PUBLIC_VAULT', filters);

    return (
        <GradientView>
            <View className="flex-1 mx-6">
                <DocumentList
                    documents={documents || []}
                    isPending={isPending}
                    isError={error}
                    onRefetch={refetch}
                    searchComponent={
                        <View className="mb-6">
                            <Text className="text-2xl font-bold text-white mb-4">Faculty Open Vault</Text>
                            
                            <SearchBar 
                                value={filters.searchQuery}
                                onChange={(q) => setFilters({...filters, searchQuery: q})}
                                className="mb-4"
                            />

                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{gap: 8}}
                            >
                                <StyledDropDown
                                    options={type}
                                    value={filters.docType}
                                    onChange={(v) => setFilters({...filters, docType: v.toString()})}
                                    placeholder="Type"
                                    size="compact"
                                    className="w-32"
                                />
                                <StyledDropDown
                                    options={years}
                                    value={filters.year}
                                    onChange={(v) => setFilters({...filters, year: v.toString()})}
                                    placeholder="Year"
                                    size="compact"
                                    className="w-32"
                                />
                                <StyledDropDown
                                    options={filterByLike}
                                    value={filters.sortByLikes}
                                    onChange={(v) => setFilters({...filters, sortByLikes: v.toString()})}
                                    placeholder="Sort"
                                    size="compact"
                                    className="w-32"
                                />
                            </ScrollView>
                        </View>
                    }
                />
            </View>
        </GradientView>
    );
}
