import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './src/components/Button';
import { styles } from './App.styles';

export default function App() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View>
        <StatusBar style="light" />

        <View>
          <Text>Conversor de Moedas</Text>
          <Text>
            Converta valores entre diferentes moedas
          </Text>
        </View>

        <View>
          <Text>De:</Text>
          <Button variant='secondary' />
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
