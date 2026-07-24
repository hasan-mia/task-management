import React from "react";
import { View, StyleSheet, Image } from "react-native";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/splash.png")} style={styles.logo} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1B4D",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "120%",
    height: "120%",
  },
});
