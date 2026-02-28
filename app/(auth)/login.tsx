// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Login Screen  (app/(auth)/login.tsx)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../store/useAuth';

export default function LoginScreen() {
  const { login }          = useAuth();
  const [empId, setEmpId]  = useState('EMP-2024-047');
  const [pass, setPass]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);

  // Shake animation for wrong credentials
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!empId.trim()) {
      shake();
      Alert.alert('Error', 'Please enter your Employee ID');
      return;
    }
    setLoading(true);
    const success = await login(empId, pass);
    if (!success) {
      setLoading(false);
      shake();
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
    // On success, _layout.tsx auth gate will redirect to (tabs)
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Background grid dots */}
        <View style={styles.bgGrid} pointerEvents="none" />

        {/* ── Logo Block ─────────────────────────────────────────────────── */}
        <View style={styles.logoBlock}>
          <View style={styles.logoIconWrap}>
            <Ionicons name="navigate" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.logoTitle}>
            FIELD<Text style={{ color: Colors.accent }}>TRACK</Text>
          </Text>
          <Text style={styles.logoSub}>ENTERPRISE FIELD OPERATIONS</Text>
        </View>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {/* Employee ID */}
          <Text style={styles.label}>EMPLOYEE ID</Text>
          <View style={[
            styles.inputWrap,
            focused === 'emp' && styles.inputFocused,
          ]}>
            <Ionicons
              name="person-outline"
              size={16}
              color={focused === 'emp' ? Colors.accent : Colors.textMuted}
            />
            <TextInput
              style={styles.input}
              value={empId}
              onChangeText={setEmpId}
              placeholder="EMP-2024-XXX"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="characters"
              onFocus={() => setFocused('emp')}
              onBlur={() => setFocused(null)}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { marginTop: 14 }]}>PASSWORD</Text>
          <View style={[
            styles.inputWrap,
            focused === 'pass' && styles.inputFocused,
          ]}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={focused === 'pass' ? Colors.accent : Colors.textMuted}
            />
            <TextInput
              style={styles.input}
              value={pass}
              onChangeText={setPass}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
              onFocus={() => setFocused('pass')}
              onBlur={() => setFocused(null)}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={8}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.loginBtnText}>AUTHENTICATING...</Text>
              </>
            ) : (
              <>
                <Ionicons name="flash" size={16} color="#000" />
                <Text style={styles.loginBtnText}>SIGN IN</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Security Notice ───────────────────────────────────────────── */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
          <Text style={styles.securityText}>
            Device security verified · Anti-spoof active
          </Text>
        </View>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Text style={styles.footer}>v2.4.1 · ENTERPRISE EDITION © 2025</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  bgGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    // Grid background is complex in RN – use a subtle overlay or skip
  },

  // Logo
  logoBlock: {
    alignItems: 'center',
    marginBottom: 44,
  },
  logoIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: `${Colors.accent}20`,
    borderWidth: 1.5,
    borderColor: `${Colors.accent}50`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 2.5,
    fontFamily: 'Courier',
    marginTop: 4,
  },

  // Form
  label: {
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputFocused: {
    borderColor: Colors.accent,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: 'Courier',
    fontSize: 14,
    paddingVertical: 14,
  },

  // Button
  loginBtn: {
    marginTop: 24,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginBtnDisabled: {
    backgroundColor: Colors.accentDim,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },

  // Security
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.successDim,
    borderWidth: 1,
    borderColor: `${Colors.success}30`,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 24,
  },
  securityText: {
    fontSize: 11,
    color: Colors.success,
    fontFamily: 'Courier',
  },

  // Footer
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'Courier',
  },
});
