import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { openUrl } from '../lib/links';
import { colors, spacing, font, text } from '../theme';

// A button that opens an official website and explains what to do if the
// device or browser cannot open it.
export default function ExternalLink({ url, label, variant = 'secondary', hint, style }) {
  const [failed, setFailed] = useState(false);

  const handlePress = async () => {
    const ok = await openUrl(url);
    setFailed(!ok);
  };

  return (
    <View style={style}>
      <Button label={label} variant={variant} onPress={handlePress} accessibilityHint={hint} />
      {failed ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          Could not open the link. Open a browser and type {url.replace('https://', '')} instead.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    ...text.small,
    color: colors.danger,
    marginTop: spacing.sm - 2,
    fontSize: font.size.sm,
  },
});
