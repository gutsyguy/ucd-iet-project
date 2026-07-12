import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

import { BottomTabInset, Colors, Spacing } from "@/constants/theme";
import { AggieFeedResponse } from "@/types/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const [data, setData] = useState<AggieFeedResponse[]>();
  const router = useRouter();

  const url = process.env.EXPO_PUBLIC_BASE_URL!;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Http error: status: ${response.status}`);
      }

      const parsed = await response.json();
      setData(parsed);
    };
    fetchData();
  }, [url]);

  const handleItemPress = (item: AggieFeedResponse) => {
    router.push({
      pathname: "/activity/[id]",
      params: {
        id: item.id.toString(),
        title: item.title,
        actorDisplayName: item.actor.displayName.toString(),
        objectType: item.object.objectType.toString(),
        published: item.published.toString(),
      },
    });
  };

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
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.actor.displayName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
