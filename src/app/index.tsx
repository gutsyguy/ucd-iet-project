import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { AggieFeedResponse } from "@/types/types";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [data, setData] = useState<AggieFeedResponse[]>();

  const url = process.env.EXPO_BASE_URL!;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      print();

      if (!response.ok) {
        throw new Error(`Http error: status: ${response.status}`);
      }

      const parsed = await response.json();
      setData(parsed);
    };
    fetchData();
  }, [data]);

  return <ThemedView style={styles.container}></ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
