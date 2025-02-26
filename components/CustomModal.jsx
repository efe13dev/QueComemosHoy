import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomModal = ({ visible, onClose, title, message, icon, iconColor, buttons }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name={icon || 'checkmark-circle'} size={60} color={iconColor || '#8B4513'} style={styles.icon} />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          
          {buttons ? (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button, 
                    button.style === 'cancel' ? styles.cancelButton : null,
                    button.loading ? styles.loadingButton : null,
                    index > 0 ? { marginLeft: 10 } : null
                  ]}
                  onPress={button.onPress}
                  disabled={button.loading || button.disabled}
                >
                  {button.loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#663300" />
                      <Text style={[
                        styles.buttonText,
                        button.style === 'cancel' ? styles.cancelButtonText : null
                      ]}>
                        {button.loadingText || 'Cargando...'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[
                      styles.buttonText,
                      button.style === 'cancel' ? styles.cancelButtonText : null
                    ]}>
                      {button.text}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: '#FFF5E6',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  icon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#663300',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#663300',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFE4B5',
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#c63636',
  },
  loadingButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#663300',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#c63636',
  },
});

export default CustomModal;
