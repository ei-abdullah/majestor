import React from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import SearchBar from "@/src/components/ui/SearchBar";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import {filterByLike, type, years} from "@/src/constants";
import {Filters} from "@/src/types/document";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";

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
                            <View className="flex-row items-center mb-6">
                                <TouchableOpacity 
                                    onPress={() => router.back()} 
                                    className="bg-white/10 p-3 rounded-2xl border border-white/10 mr-4"
                                >
                                    <Feather name="arrow-left" size={20} color="white" />
                                </TouchableOpacity>
                                <Text className="text-3xl font-bold text-white">Faculty Vault</Text>
                            </View>
                            
                            <SearchBar 
                                placeholder="Search all public resources..." 
                                value={filters.searchQuery}
                                onChange={(q) => setFilters({...filters, searchQuery: q})}
                                className="mb-4 bg-white/90 shadow-blue"
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
                                    className="w-32 bg-white/10 border-white/10"
                                    textStyle={{color: 'white'}}
                                />
                                <StyledDropDown
                                    options={years}
                                    value={filters.year}
                                    onChange={(v) => setFilters({...filters, year: v.toString()})}
                                    placeholder="Year"
                                    size="compact"
                                    className="w-32 bg-white/10 border-white/10"
                                    textStyle={{color: 'white'}}
                                />
                                <StyledDropDown
                                    options={filterByLike}
                                    value={filters.sortByLikes}
                                    onChange={(v) => setFilters({...filters, sortByLikes: v.toString()})}
                                    placeholder="Sort"
                                    size="compact"
                                    className="w-32 bg-white/10 border-white/10"
                                    textStyle={{color: 'white'}}
                                />
                            </ScrollView>
                        </View>
                    }
                />
            </View>
        </GradientView>
    );
}
