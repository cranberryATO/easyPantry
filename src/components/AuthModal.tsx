import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Page } from "@/components/Page";
import { Modal, StyleSheet, Text, View } from "react-native";
export default function AuthModal({
  isVisible,
  signIn,
}: {
  isVisible: boolean;
  signIn: () => void;
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Page>
            <Text style={styles.title}>
              Connectez-vous avec votre compte Google pour utiliser
              l'application
            </Text>
            <GoogleSignInButton onPress={signIn} />
          </Page>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "80%",
    height: "40%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
