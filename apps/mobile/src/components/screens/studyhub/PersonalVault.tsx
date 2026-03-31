import React from "react";
import {View, Text} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useVault} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import DocumentList from "./DocumentList";
import Card from "@/src/components/ui/Card";
import {Feather} from "@expo/vector-icons";

export default function PersonalVault() {
    const {user} = useAuthStore();
    const {data: documents, isPending, error, refetch} = useVault(user!.id, 'PERSONAL_VAULT', {
        searchQuery: '',
        year: '',
        docType: '',
        sortByLikes: ''
    });

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
                        <View className="mb-6">
                            <Text className="text-2xl font-bold text-white mb-4">My Personal Vault</Text>
                            
                            <Card className="bg-white/10 border-white/10 p-4">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-white/60 text-xs font-bold uppercase">Storage Used</Text>
                                    <Text className="text-white font-bold text-xs">
                                        {storageUsedMB.toFixed(1)}MB / {storageLimitMB.toFixed(0)}MB
                                    </Text>
                                </View>
                                
                                {/* Progress Bar */}
                                <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <View 
                                        className="h-full bg-primary" 
                                        style={{ width: `${usagePercentage}%` }} 
                                    />
                                </View>
                                
                                <View className="flex-row items-center mt-3">
                                    <Feather name="info" size={12} color="rgba(255,255,255,0.4)" />
                                    <Text className="text-white/40 text-[10px] ml-1 italic">
                                        Only private uploads count towards your quota.
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
