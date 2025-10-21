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

const TestDropdown: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const items = [
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Dropdown</Text>
        
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowModal(true)}
        >
          <Text style={[
            styles.dropdownText,
            !selectedItem && styles.dropdownPlaceholder
          ]}>
            {selectedItem || 'Select an item'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={true}>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalItem,
                      selectedItem === item && styles.modalItemSelected,
                      index === items.length - 1 && { borderBottomWidth: 0 }
                    ]}
                    onPress={() => {
                      setSelectedItem(item);
                      setShowModal(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      selectedItem === item && styles.modalItemTextSelected
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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

export default TestDropdown;