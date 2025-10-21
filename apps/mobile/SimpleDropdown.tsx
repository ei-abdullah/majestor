import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SimpleDropdownProps {
  onBack: () => void;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({ onBack }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);

  const universities = [
    'COMSATS University Islamabad',
    'National University of Sciences and Technology (NUST)',
    'Quaid-i-Azam University',
    'International Islamic University, Islamabad (IIUI)',
    'Pakistan Institute of Engineering and Applied Sciences (PIEAS)',
    'Air University',
    'Federal Urdu University of Arts, Sciences and Technology',
    'Capital University of Science and Technology (CUST)',
    'Foundation University Islamabad',
    'Riphah International University',
    'Bahria University Islamabad',
    'Preston University',
    'Iqra University Islamabad',
    'Arid Agriculture University',
    'Allama Iqbal Open University',
  ];

  const faculties = [
    'Faculty of Computing',
    'Faculty of Engineering',
    'Faculty of Medical Sciences',
    'Faculty of Business Administration',
    'Faculty of Social Sciences',
    'Faculty of Natural Sciences',
    'Faculty of Arts and Humanities',
    'Faculty of Law',
    'Faculty of Education',
    'Faculty of Agriculture',
    'Faculty of Architecture and Design',
    'Faculty of Economics',
    'Faculty of Psychology',
    'Faculty of Mathematics',
    'Faculty of Physics',
    'Faculty of Chemistry',
    'Faculty of Biology',
    'Faculty of Environmental Sciences',
    'Faculty of Management Sciences',
    'Faculty of Communication and Media Studies',
  ];

  const handleComplete = () => {
    if (selectedUniversity && selectedFaculty) {
      console.log('Registration completed:', { selectedUniversity, selectedFaculty });
      onBack();
    }
  };

  const DropdownModal = ({ 
    visible, 
    items, 
    onSelect, 
    onClose, 
    selectedValue,
    title 
  }: {
    visible: boolean;
    items: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
    selectedValue: string;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={true}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  selectedValue === item && styles.modalItemSelected,
                  index === items.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>University Information</Text>
        <Text style={styles.subtitle}>Select your university and faculty</Text>

        {/* University Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>University *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowUniversityModal(true)}
          >
            <Text style={[
              styles.dropdownText,
              !selectedUniversity && styles.dropdownPlaceholder
            ]}>
              {selectedUniversity || 'Select your university'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Faculty Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Faculty *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowFacultyModal(true)}
          >
            <Text style={[
              styles.dropdownText,
              !selectedFaculty && styles.dropdownPlaceholder
            ]}>
              {selectedFaculty || 'Select your faculty'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            !(selectedUniversity && selectedFaculty) && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!(selectedUniversity && selectedFaculty)}
        >
          <Text style={[
            styles.completeButtonText,
            !(selectedUniversity && selectedFaculty) && styles.completeButtonTextDisabled
          ]}>
            Complete Registration
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <DropdownModal
        visible={showUniversityModal}
        items={universities}
        onSelect={setSelectedUniversity}
        onClose={() => setShowUniversityModal(false)}
        selectedValue={selectedUniversity}
        title="Select University"
      />

      <DropdownModal
        visible={showFacultyModal}
        items={faculties}
        onSelect={setSelectedFaculty}
        onClose={() => setShowFacultyModal(false)}
        selectedValue={selectedFaculty}
        title="Select Faculty"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#6B7280',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  completeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButtonTextDisabled: {
    color: '#9CA3AF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: Dimensions.get('window').height * 0.6,
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 20,
  },
  modalItemTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default SimpleDropdown;