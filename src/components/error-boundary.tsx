import React, { Component, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string;
};

/**
 * Catches unhandled render-phase errors anywhere in the subtree so the app
 * never shows a blank crash screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Log to a crash reporting service in production (e.g. Sentry).
    console.error("[ErrorBoundary] Uncaught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
    backgroundColor: Colors.light.background,
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
});
