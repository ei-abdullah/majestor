/**
 * User Settings Screen
 * Shows user profile information with three sections:
 * 1. University Information - Full name, student ID, university, faculty, email
 * 2. Personal Information - Personal email, phone number
 * 3. Your Roles - Student, Volunteer, Event Organizer badges
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface UserSettingsScreenProps {
  onBack?: () => void;
  user?: {
    initials?: string;
    fullName?: string;
    studentId?: string;
    universityName?: string;
    facultyName?: string;
    universityEmail?: string;
    personalEmail?: string;
    phoneNumber?: string;
    roles?: string[];
  };
}

export default function UserSettingsScreen({ 
  onBack,
  user: userProp,
}: UserSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Use user prop data or default mock data
  const user = userProp || {
    initials: 'AS',
    fullName: 'Ahmed Shahid',
    studentId: 'k21-1234',
    universityName: 'FAST-NUCES',
    facultyName: 'Computer Science',
    universityEmail: 'k21-1234@nu.edu.pk',
    personalEmail: 'ahmedshahid@gmail.com',
    phoneNumber: '+92 300 1234567',
    roles: ['Student'],
  };

  const handleTakePhoto = async () => {
    setShowImagePicker(false);
    
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleChooseFromGallery = async () => {
    setShowImagePicker(false);
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to choose photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Failed to choose photo. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar with Edit Button */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.initials}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton} 
              activeOpacity={0.8}
              onPress={() => setShowImagePicker(true)}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* University Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>University Information</Text>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="person-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Text style={styles.fieldValue}>{user.fullName}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="card-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Student ID</Text>
              <Text style={styles.fieldValue}>{user.studentId}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="school-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>University Name</Text>
              <Text style={styles.fieldValue}>{user.universityName}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="book-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Faculty Name</Text>
              <Text style={styles.fieldValue}>{user.facultyName}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>University Email</Text>
              <Text style={styles.fieldValue}>{user.universityEmail}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Personal Email</Text>
              <Text style={styles.fieldValue}>{user.personalEmail}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldIconContainer}>
              <Ionicons name="call-outline" size={18} color="#6B7280" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
            </View>
          </View>
        </View>

        {/* Your Roles Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Roles</Text>
          
          <View style={styles.rolesContainer}>
            {user.roles?.map((role, index) => (
              <View 
                key={index} 
                style={[
                  styles.roleBadge,
                  role === 'Student' && styles.studentBadge,
                  role === 'Volunteer' && styles.volunteerBadge,
                  role === 'Event Organizer' && styles.organizerBadge,
                ]}
              >
                <Text style={[
                  styles.roleBadgeText,
                  role === 'Student' && styles.studentBadgeText,
                  role === 'Volunteer' && styles.volunteerBadgeText,
                  role === 'Event Organizer' && styles.organizerBadgeText,
                ]}>{role}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>

            <View style={styles.modalAvatarContainer}>
              <View style={styles.modalAvatar}>
                <Ionicons name="camera" size={40} color="#4A90E2" />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.modalOption} 
              activeOpacity={0.7}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera-outline" size={20} color="#1A1A1A" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption} 
              activeOpacity={0.7}
              onPress={handleChooseFromGallery}
            >
              <Ionicons name="images-outline" size={20} color="#1A1A1A" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton} 
              activeOpacity={0.7}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fieldIconContainer: {
    width: 24,
    marginRight: 12,
    marginTop: 2,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  studentBadge: {
    backgroundColor: '#DBEAFE',
  },
  volunteerBadge: {
    backgroundColor: '#F3E8FF',
  },
  organizerBadge: {
    backgroundColor: '#FEF3C7',
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  studentBadgeText: {
    color: '#1E40AF',
  },
  volunteerBadgeText: {
    color: '#7C3AED',
  },
  organizerBadgeText: {
    color: '#D97706',
  },
  bottomSpacer: {
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  modalCancelButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
});
