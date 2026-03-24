import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { hardShadow, outline, theme } from "../utils/theme";

const { width } = Dimensions.get("window");

const CustomModal = memo(function CustomModal({
  visible,
  onClose,
  title,
  message,
  icon,
  iconColor,
  buttons,
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animatable.View
          animation="zoomIn"
          duration={280}
          useNativeDriver
          style={styles.modalView}
        >
          <Ionicons
            name={icon || "checkmark-circle"}
            size={60}
            color={iconColor || theme.colors.primary}
            style={styles.icon}
          />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          {buttons ? (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.button,
                    button.style === "cancel" ? styles.cancelButton : null,
                    button.loading ? styles.loadingButton : null,
                    index > 0 ? { marginLeft: 10 } : null,
                    pressed ? { transform: [{ scale: 0.96 }] } : null,
                  ]}
                  onPress={button.onPress}
                  disabled={button.loading || button.disabled}
                >
                  {button.loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.textDark}
                      />
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === "cancel"
                            ? styles.cancelButtonText
                            : null,
                        ]}
                      >
                        {button.loadingText || "Cargando..."}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === "cancel"
                          ? styles.cancelButtonText
                          : null,
                      ]}
                    >
                      {button.text}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          ) : (
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </Pressable>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    padding: theme.spacing.lg,
    alignItems: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  icon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  modalText: {
    fontSize: 16,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    color: theme.colors.textDark,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    padding: theme.spacing.sm,
    minWidth: 120,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
  },
  loadingButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    fontSize: theme.fontSize.base,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: theme.colors.danger,
  },
});

export default CustomModal;
