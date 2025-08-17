import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { hardShadow, outline, theme } from "../../utils/theme";

// Utilidades simples para convertir hex -> rgba

function hexToRgb(hex) {
  let h = hex.replace("#", "");

  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

function hexToRgba(hex, alpha = 1) {
  try {
    const { r, g, b } = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (_e) {
    return hex; // fallback
  }
}

// Mezcla un color con blanco para obtener un tinte opaco y suave
function tintWithWhite(hex, t = 0.92) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * t);

  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

const { width, height } = Dimensions.get("window");

export default function NeoDropdown({
  value,
  items = [],
  placeholder = "Selecciona...",
  onValueChange,
  accentColor,
  onPressIn,
  onPressOut,
}) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => items.find((i) => i.value === value),
    [items, value],
  );
  const label = selected?.label || placeholder;

  const accent = accentColor || theme.colors.primary;
  const panelBg = tintWithWhite(accent, 0.92);
  const selectedBg = hexToRgba(accent, 0.16);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}
        onPress={() => setOpen(true)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        android_ripple={{ color: theme.colors.textDark, borderless: false }}
        accessibilityRole="button"
        accessibilityLabel="Abrir selector"
      >
        <Text
          style={[styles.boxText, !selected && styles.placeholderText]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.ink} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.panel, { backgroundColor: panelBg }]}>
            <View style={[styles.headerBar, { backgroundColor: accent }]} />
            <Text style={[styles.title, { textShadowColor: accent }]}>
              Selecciona receta
            </Text>
            <FlatList
              data={items}
              keyExtractor={(item, idx) => `${item.value}-${idx}`}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isSelected && [
                        styles.itemSelected,
                        { backgroundColor: selectedBg, borderColor: accent },
                      ],
                    ]}
                    onPress={() => {
                      onValueChange?.(item.value);
                      setOpen(false);
                    }}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && [
                          styles.itemTextSelected,
                          { textShadowColor: accent },
                        ],
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.closeBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Caja visible en el input (usa el contenedor del WeekDayPicker)
  box: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  boxPressed: {
    opacity: 0.9,
  },
  boxText: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    marginRight: 8,
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontStyle: "italic",
  },

  // Modal / Panel
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  panel: {
    width: Math.min(width * 0.9, 480),
    maxHeight: height * 0.7,
    borderRadius: 0,
    padding: theme.spacing.md,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  headerBar: {
    height: 8,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 18,
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  item: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: 4,
    ...outline({ width: 2 }),
  },
  itemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(255,183,3,0.12)",
  },
  itemText: {
    color: theme.colors.textDark,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
  },
  itemTextSelected: {
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    fontFamily: theme.fonts.bold,
  },
  closeBtn: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    padding: theme.spacing.sm,
    alignItems: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  closeBtnText: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
