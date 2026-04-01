import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import Card from "@/src/components/ui/Card";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";

export default function PersonalVault() {
    const {user} = useAuthStore();
    const {data: documents, isPending, error, refetch} = useVault(user!.id, 'PERSONAL_VAULT', {
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: ''
    });

    // Updated to use totalStorageUsed and storageLimit from AuthUserDTO
    const storageUsedMB = (user?.totalStorageUsed || 0) / (1024 * 1024);
    const storageLimitMB = (user?.storageLimit || 104857600) / (1024 * 1024);
    const usagePercentage = Math.min((storageUsedMB / storageLimitMB) * 100, 100);

    return (
        <GradientView>
            <View className="flex-1 mx-6">
                <DocumentList
                    documents={documents || []}
                    isPending={isPending}
                    isError={error}
                    onRefetch={refetch}
                    searchComponent={
                        <View className="mb-8">
                            <View className="flex-row items-center mb-8">
                                <TouchableOpacity 
                                    onPress={() => router.back()} 
                                    className="bg-white/10 p-3.5 rounded-2xl border border-white/10 mr-4 shadow-sm"
                                >
                                    <Feather name="arrow-left" size={20} color="white" />
                                </TouchableOpacity>
                                <View>
                                    <Text className="text-mj-teal text-[10px] font-black uppercase tracking-[2px]">Private Cloud</Text>
                                    <Text className="text-3xl font-bold text-white">My Vault</Text>
                                </View>
                            </View>
                            
                            <Card className="bg-mj-bg-white rounded-[32px] shadow-blue border-0 p-7">
                                <View className="flex-row justify-between items-start mb-5">
                                    <View>
                                        <Text className="text-mj-text-secondary text-[10px] font-black uppercase tracking-widest">Storage Status</Text>
                                        <Text className="text-mj-text-main font-bold text-3xl mt-1">
                                            {usagePercentage.toFixed(0)}%
                                        </Text>
                                    </View>
                                    <View className="bg-mj-blue-50 p-4 rounded-2xl shadow-sm border border-mj-blue-100">
                                        <Feather name="database" size={24} color="#3A6FF8" />
                                    </View>
                                </View>
                                
                                {/* Progress Bar - Majestor Brand Style */}
                                <View className="h-3 bg-mj-bg-blue rounded-full overflow-hidden border border-mj-bg-blue shadow-inner">
                                    <View 
                                        className="h-full bg-mj-blue rounded-full" 
                                        style={{ width: `${usagePercentage}%` }} 
                                    />
                                </View>
                                
                                <View className="flex-row justify-between mt-4">
                                    <Text className="text-mj-text-secondary text-xs font-bold">
                                        {storageUsedMB.toFixed(1)} MB <Text className="font-medium opacity-50">Used</Text>
                                    </Text>
                                    <Text className="text-mj-text-secondary text-xs font-bold">
                                        {storageLimitMB.toFixed(0)} MB <Text className="font-medium opacity-50">Limit</Text>
                                    </Text>
                                </View>
                            </Card>
                        </View>
                    }
                />
            </View>
        </GradientView>
    );
}
