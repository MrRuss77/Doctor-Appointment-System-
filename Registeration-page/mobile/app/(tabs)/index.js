import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.74:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.text();
      Alert.alert(data);
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navbar}>
          <View>
            <Text style={styles.brand}>🩺 Doctris</Text>
          </View>
          <View style={styles.navLinks}>
            <TouchableOpacity>
              <Text style={styles.navLink}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.navLink}>Doctors</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.navLink}>Departments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.heading}>Register</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginAnchor}>Login</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Doctris. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  navbar: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  brand: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  navLink: {
    marginHorizontal: 10,
    color: "#333",
  },
  loginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginLeft: 10,
  },
  loginBtnText: {
    color: "white",
  },
  container: {
    padding: 30,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  input: {
    marginVertical: 5,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#000",
  },
  loginAnchor: {
    fontSize: 14,
    color: "#007bff",
  },
});