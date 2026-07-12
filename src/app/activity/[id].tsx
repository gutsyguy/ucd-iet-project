import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    actorDisplayName: string;
    objectType: string;
    published: string;
  }>();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  const formattedDate = params.published
    ? new Date(params.published).toLocaleString()
    : "—";

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.four },
      ]}
    >
      <View style={styles.inner}>
        {/* Title */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
          <Text style={[styles.value, { color: colors.text }]}>{params.title || "—"}</Text>
        </View>

        {/* Actor Display Name */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Actor</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {params.actorDisplayName || "—"}
          </Text>
        </View>

        {/* Object Type */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Object Type</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {params.objectType || "—"}
          </Text>
        </View>

        {/* Published */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Published</Text>
          <Text style={[styles.value, { color: colors.text }]}>{formattedDate}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
  },
});
