import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomTabInset, Colors, Spacing } from "@/constants/theme";
import { AggieFeedResponse } from "@/types/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export default function HomeScreen() {
  const [data, setData] = useState<AggieFeedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const url = process.env.EXPO_PUBLIC_BASE_URL;

  const fetchData = useCallback(async () => {
    if (!url) {
      setError("API URL is not configured. Check EXPO_PUBLIC_BASE_URL.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const parsed = await response.json();

      if (!Array.isArray(parsed)) {
        throw new Error("Unexpected response format from API.");
      }

      setData(parsed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  const handleItemPress = (item: AggieFeedResponse) => {
    router.push({
      pathname: "/activity/[id]",
      params: {
        id: item.id?.toString() ?? "",
        title: item.title ?? "",
        actorDisplayName: item.actor?.displayName?.toString() ?? "",
        objectType: item.object?.objectType?.toString() ?? "",
        published: item.published?.toString() ?? "",
      },
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.textSecondary} />
        <Text style={styles.statusText}>Loading activities…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }: { item: AggieFeedResponse }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>{item.title ?? "Untitled"}</Text>
            <Text style={styles.cardSubtitle}>
              {item.actor?.displayName?.toString() ?? "Unknown actor"}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.id?.toString() ?? String(index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.statusText}>No activities found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: Spacing.one,
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    padding: Spacing.four,
  },
  statusText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Spacing.two,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  listContent: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
