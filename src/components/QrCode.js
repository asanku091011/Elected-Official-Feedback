import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import qrcode from 'qrcode-generator';
import { colors, spacing } from '../theme';

// Draws a QR code from a URL entirely on the device. No image is downloaded and
// nothing is sent to a QR service. The app adds the quiet zone (the blank margin
// scanners need) around the modules.
export default function QrCode({ value, size = 196 }) {
  const matrix = useMemo(() => {
    if (!value) return null;
    try {
      // 0 lets the library pick the smallest version that fits; M is a good
      // mid-level error correction for a printed or on-screen code.
      const qr = qrcode(0, 'M');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      const rows = [];
      for (let row = 0; row < count; row += 1) {
        const cells = [];
        for (let col = 0; col < count; col += 1) {
          cells.push(qr.isDark(row, col));
        }
        rows.push(cells);
      }
      return { count, rows };
    } catch (error) {
      // A URL that is too long for a QR code should show nothing rather than
      // crash the screen.
      return null;
    }
  }, [value]);

  if (!matrix) {
    return <View style={[styles.fallback, { width: size, height: size }]} />;
  }

  const cell = size / matrix.count;

  return (
    <View
      style={[styles.frame, { padding: spacing.sm }]}
      accessibilityRole="image"
      accessibilityLabel="QR code for the CivLink web app"
    >
      <View style={{ width: size, height: size, backgroundColor: colors.white }}>
        {matrix.rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((dark, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={{ width: cell, height: cell, backgroundColor: dark ? colors.ink : colors.white }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  fallback: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignSelf: 'center',
  },
});
