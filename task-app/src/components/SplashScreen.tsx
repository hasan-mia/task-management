import React from "react";
import { View, StyleSheet, Image } from "react-native";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/splash.png")} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
