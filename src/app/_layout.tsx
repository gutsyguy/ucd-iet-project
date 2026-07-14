import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ErrorBoundary } from '@/components/error-boundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="activity/[id]"
            options={{
              headerShown: true,
              title: 'Activity Detail',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
