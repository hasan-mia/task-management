import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaFrameContext } from "react-native-safe-area-context";
import { RootNavigator } from "@/navigation/RootNavigator";
import { SplashScreen } from "@/components/SplashScreen";
// The CSS file is consumed by the web bundler and has no TypeScript module declaration.
// @ts-expect-error -- side-effect CSS import
import "./global.css";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <SafeAreaFrameContext.Provider value={{ x: 0, y: 20, width: 0, height: 0 }}>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaFrameContext.Provider>
    </QueryClientProvider>
  );
}
