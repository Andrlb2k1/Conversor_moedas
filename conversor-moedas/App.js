import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './src/components/Button';
import { Input } from './src/components/Input';
import { colors } from './src/styles/colors';
import { currencies } from './src/constants/currencies';
import { ResultCard } from './src/components/ResultCard';
import { exchangeRateApi } from './src/services/api';
import { convertCurrency } from './src/utils/convertCurrency';
import { useState } from 'react';

export default function App() {

  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(null)

  async function fetchExchangeRate() {

    try {
      setLoading(true)
      if (!amount) return

      const data = await exchangeRateApi(fromCurrency)
      const rate = data.rates[toCurrency]

      setExchangeRate(rate)

      const convertedAmount = await convertCurrency(amount, rate)

      setResult(convertedAmount)
    } catch (er) {
      alert('Erro! Tente novamente!')
    } finally {
      setLoading(false)
    }
  }

  function swapCurrency() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)

    setResult('')
  }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <StatusBar style="light" />

            <View style={styles.header}>
              <Text style={styles.title}>Conversor de Moedas</Text>
              <Text style={styles.subTitle}>
                Converta valores entre diferentes moedas
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>De: </Text>

              <View style={styles.currencyGrid}>
                {currencies.map(currency => (
                  <Button
                    variant='primary'
                    key={currency.code}
                    currency={currency}
                    onPress={() => setFromCurrency(currency.code)}
                    isSelected={fromCurrency === currency.code}
                  />
                ))}
              </View>

              <Input label='Valor: ' value={amount} onChangeText={setAmount} />

              <TouchableOpacity style={styles.swapButton} onPress={swapCurrency}>
                <Text style={styles.swapButtonText}>
                  ↑↓
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Para: </Text>
              <View style={styles.currencyGrid}>
                {currencies.map(currency => (
                  <Button
                    variant='secondary'
                    key={currency.code}
                    currency={currency}
                    onPress={() => setToCurrency(currency.code)}
                    isSelected={toCurrency === currency.code}
                  />
                ))}
              </View>

            </View>

            <TouchableOpacity
              style={[styles.convertButton, (!amount || loading) && styles.convertButtonDisabled]}
              onPress={fetchExchangeRate}
              disabled={!amount || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.swapButtonText}>
                  Converter
                </Text>
              )}
            </TouchableOpacity>

            <ResultCard
              exchangeRate={exchangeRate}
              result={result}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              currencies={currencies}
            />

          </View>
        </ScrollView>

      </KeyboardAvoidingView >
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 24,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subTitle: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
    },
    label: {
      color: colors.textSecondary,
      marginBottom: 8,
      fontSize: 14,
    },
    currencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -9,
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swapButton: {
      backgroundColor: colors.inputBackground,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginBottom: 24,
    },
    swapButtonText: {
      color: colors.text,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
    },
    convertButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginBottom: 24,
    },
    convertButtonDisabled: {
      backgroundColor: colors.disabled,
    },
  });
