import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Animated, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({
  label, error, icon, inputProps,
  focused, onClear, clearable, toggleSecure, isSecure,
}) => {
  const labelColor  = focused ? '#60a5fa' : error ? '#f87171' : '#475569';
  const iconColor   = focused ? '#3b82f6' : error ? '#f87171' : '#334155';
  const borderColor = error ? '#ef4444' : focused ? '#2563eb' : '#1e293b';
  const bgColor     = focused ? '#0d1d35' : '#080f1e';

  return (
    <View style={{ marginBottom: 20 }}>

      {/* Label + error row */}
      <View className="flex-row justify-between items-center" style={{ marginBottom: 8 }}>
        <Text style={{
          color: labelColor,
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          {label}
        </Text>
        {error ? (
          <View className="flex-row items-center">
            <Ionicons name="alert-circle-outline" size={12} color="#f87171" style={{ marginRight: 3 }} />
            <Text style={{ color: '#f87171', fontSize: 11, fontWeight: '600', letterSpacing: 0.3 }}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Input container */}
      <View
        className="flex-row items-center rounded-2xl border"
        style={{
          height: 58,
          paddingHorizontal: 18,
          backgroundColor: bgColor,
          borderColor,
          borderWidth: 1.5,
        }}
      >
        {/* Leading icon */}
        <View
          className="items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            backgroundColor: focused ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>

        <TextInput
          style={{
            flex: 1,
            color: '#e2e8f0',
            fontSize: 15.5,
            fontWeight: '400',
            letterSpacing: 0.2,
          }}
          placeholderTextColor="#1e3a5f"
          {...inputProps}
        />

        {clearable && inputProps.value?.length > 0 && (
          <TouchableOpacity onPress={onClear} className="p-1" style={{ marginLeft: 6 }}>
            <Ionicons name="close-circle" size={18} color="#1e3a5f" />
          </TouchableOpacity>
        )}
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure} className="p-1" style={{ marginLeft: 6 }}>
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={!isSecure ? '#3b82f6' : '#1e3a5f'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameError, setUsernameError]     = useState('');
  const [passwordError, setPasswordError]     = useState('');

  const passwordRef  = useRef(null);
  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const titleSlide   = useRef(new Animated.Value(-32)).current;
  const cardSlide    = useRef(new Animated.Value(48)).current;
  const badgeSlide   = useRef(new Animated.Value(16)).current;
  const glowPulse    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,   { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(titleSlide, { toValue: 0, tension: 60, friction: 12, delay: 60,  useNativeDriver: true }),
      Animated.spring(cardSlide,  { toValue: 0, tension: 50, friction: 14, delay: 220, useNativeDriver: true }),
      Animated.spring(badgeSlide, { toValue: 0, tension: 65, friction: 11, delay: 20,  useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 3200, useNativeDriver: false }),
        Animated.timing(glowPulse, { toValue: 0, duration: 3200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.16] });
  const accentAnim  = glowPulse.interpolate({ inputRange: [0, 1], outputRange: ['#1d4ed8', '#3b82f6'] });

  const validate = () => {
    let valid = true;
    if (!username.trim())         { setUsernameError('Required');          valid = false; } else setUsernameError('');
    if (!password)                { setPasswordError('Required');           valid = false; }
    else if (password.length < 6) { setPasswordError('Min. 6 characters'); valid = false; }
    else setPasswordError('');
    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('MainStack'); }, 1500);
  };

  const getStrength = () => {
    if (!password)             return null;
    if (password.length < 6)  return { label: 'Weak',   color: '#ef4444', width: '20%' };
    if (password.length < 8)  return { label: 'Fair',   color: '#f97316', width: '45%' };
    if (password.length < 12) return { label: 'Good',   color: '#3b82f6', width: '70%' };
    return                           { label: 'Strong', color: '#22c55e', width: '100%' };
  };
  const strength = getStrength();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: '#050d1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#050d1a" />

      {/* ── Decorative background ── */}
      <View pointerEvents="none" className="absolute inset-0">
        {/* Grid lines — horizontal */}
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((p, i) => (
          <View
            key={`h${i}`}
            style={{ position: 'absolute', top: height * p, left: 0, right: 0, height: 1, backgroundColor: 'rgba(30,64,175,0.06)' }}
          />
        ))}
        {/* Grid lines — vertical */}
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((p, i) => (
          <View
            key={`v${i}`}
            style={{ position: 'absolute', left: width * p, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(30,64,175,0.06)' }}
          />
        ))}

        {/* Top-left glow */}
        <Animated.View style={{
          position: 'absolute', top: -200, left: -150,
          width: 480, height: 480, borderRadius: 240,
          backgroundColor: '#1e3a8a', opacity: glowOpacity,
        }} />
        {/* Bottom-right glow */}
        <Animated.View style={{
          position: 'absolute', bottom: -160, right: -120,
          width: 380, height: 380, borderRadius: 190,
          backgroundColor: '#1d4ed8', opacity: glowOpacity,
        }} />
        {/* Mid accent */}
        <View style={{
          position: 'absolute', top: height * 0.38, right: -80,
          width: 220, height: 220, borderRadius: 110,
          backgroundColor: '#172554', opacity: 0.08,
        }} />

        {/* Star particles */}
        {[
          { top: '6%',  left: '16%', s: 2.5, o: 0.55 },
          { top: '11%', left: '84%', s: 2,   o: 0.4  },
          { top: '28%', left: '5%',  s: 1.5, o: 0.35 },
          { top: '52%', left: '93%', s: 2,   o: 0.45 },
          { top: '70%', left: '10%', s: 2,   o: 0.5  },
          { top: '85%', left: '72%', s: 1.5, o: 0.35 },
          { top: '20%', left: '58%', s: 1.5, o: 0.3  },
          { top: '62%', left: '42%', s: 1,   o: 0.25 },
          { top: '40%', left: '78%', s: 1.5, o: 0.3  },
        ].map((d, i) => (
          <View
            key={`st${i}`}
            style={{
              position: 'absolute', top: d.top, left: d.left,
              width: d.s, height: d.s, borderRadius: d.s,
              backgroundColor: `rgba(147,197,253,${d.o})`,
            }}
          />
        ))}
      </View>

      <SafeAreaView className="flex-1 ">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 24, paddingBottom: 56 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          {/* ── Hero headline ── */}
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: titleSlide }] }}
            className="mb-11 "
          >
            {/* Main title */}
            <View style={{ marginBottom: 2 }}>
              <Text style={{
                fontSize: 52,
                fontWeight: '900',
                letterSpacing: -2,
                lineHeight: 54,
                color: '#f1f5f9',
              }}>
                Welcome
              </Text>
              <Text style={{
                fontSize: 52,
                fontWeight: '900',
                letterSpacing: -2,
                lineHeight: 58,
                color: '#2563eb',
              }}>
                Back
              </Text>
            </View>

            {/* Subtitle separator */}
            <View
              className="flex-row items-center"
              style={{ marginTop: 20, marginBottom: 14, gap: 10 }}
            >
              <View style={{ width: 24, height: 2, borderRadius: 1, backgroundColor: '#1d4ed8' }} />
              <View style={{ width: 6,  height: 2, borderRadius: 1, backgroundColor: '#1e3a5f' }} />
            </View>

            {/* Subtitle text */}
            <Text style={{
              color: '#475569',
              fontSize: 15,
              fontWeight: '400',
              lineHeight: 25,
              letterSpacing: 0.15,
            }}>
              Sign in to explore our curated{'\n'}product catalog.
            </Text>
          </Animated.View>

          {/* ── Form card ── */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: cardSlide }] }}>
            <View
              className="rounded-3xl border"
              style={{
                backgroundColor: '#080f1e',
                borderColor: '#0f2044',
                borderWidth: 1.5,
                padding: 28,
                shadowColor: '#1d4ed8',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.22,
                shadowRadius: 40,
                elevation: 22,
              }}
            >

             

              {/* Section label */}
              <Text style={{
                color: '#1e3a5f',
                fontSize: 9,
                fontWeight: '800',
                letterSpacing: 3.5,
                textTransform: 'uppercase',
                marginBottom: 24,
              }}>
                Account credentials
              </Text>

              {/* Username field */}
              <Field
                label="Username"
                error={usernameError}
                icon="person-outline"
                focused={usernameFocused}
                clearable
                onClear={() => setUsername('')}
                inputProps={{
                  value: username,
                  placeholder: 'Enter your username',
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  returnKeyType: 'next',
                  onChangeText: (t) => { setUsername(t); if (usernameError) setUsernameError(''); },
                  onFocus: () => setUsernameFocused(true),
                  onBlur:  () => setUsernameFocused(false),
                  onSubmitEditing: () => passwordRef.current?.focus(),
                }}
              />

              {/* Password field */}
              <Field
                label="Password"
                error={passwordError}
                icon="lock-closed-outline"
                focused={passwordFocused}
                toggleSecure={() => setShowPassword(p => !p)}
                isSecure={!showPassword}
                inputProps={{
                  ref: passwordRef,
                  value: password,
                  placeholder: 'Min. 6 characters',
                  secureTextEntry: !showPassword,
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  returnKeyType: 'done',
                  onSubmitEditing: handleLogin,
                  onChangeText: (t) => { setPassword(t); if (passwordError) setPasswordError(''); },
                  onFocus: () => setPasswordFocused(true),
                  onBlur:  () => setPasswordFocused(false),
                }}
              />

              {/* Password strength — single continuous bar */}
              {strength && !passwordError && (
                <View style={{ marginTop: -8, marginBottom: 4 }}>
                  <View
                    className="rounded-full overflow-hidden"
                    style={{ height: 3, backgroundColor: '#0f172a' }}
                  >
                    <Animated.View style={{
                      height: 3,
                      width: strength.width,
                      backgroundColor: strength.color,
                      borderRadius: 99,
                    }} />
                  </View>
                  <Text style={{
                    color: strength.color,
                    fontSize: 10,
                    fontWeight: '700',
                    letterSpacing: 1.2,
                    marginTop: 6,
                    textTransform: 'uppercase',
                  }}>
                    {strength.label} password
                  </Text>
                </View>
              )}

              {/* Forgot password */}
              <TouchableOpacity
                className="self-end"
                style={{ marginTop: 16, marginBottom: 28 }}
              >
                <Text style={{
                  color: '#3b82f6',
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.1,
                  opacity: 0.75,
                }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              {/* ── Sign In button ── */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
                className="flex-row items-center justify-center rounded-2xl"
                style={{
                  height: 60,
                  backgroundColor: loading ? '#1e3a8a' : '#2563eb',
                  borderWidth: 1,
                  borderColor: loading ? '#1e40af' : '#3b82f6',
                  shadowColor: '#2563eb',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: loading ? 0.1 : 0.5,
                  shadowRadius: 24,
                  elevation: 14,
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#93c5fd" size="small" />
                    <Text style={{
                      color: '#93c5fd',
                      fontWeight: '700',
                      fontSize: 12,
                      marginLeft: 10,
                      letterSpacing: 2.2,
                      textTransform: 'uppercase',
                    }}>
                      Signing in…
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: 14,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      marginRight: 14,
                    }}>
                      Sign In
                    </Text>
                    <View style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Ionicons name="arrow-forward" size={15} color="#fff" />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center" style={{ marginTop: 28, marginBottom: 20 }}>
                <View className="flex-1" style={{ height: 1, backgroundColor: '#0f172a' }} />
                <Text style={{
                  color: '#1e3a5f',
                  fontSize: 10,
                  fontWeight: '600',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginHorizontal: 16,
                }}>
                  secured
                </Text>
                <View className="flex-1" style={{ height: 1, backgroundColor: '#0f172a' }} />
              </View>

              {/* Trust badges */}
              <View className="flex-row justify-center items-center" style={{ gap: 24 }}>
                {[
                  { icon: 'shield-checkmark-outline', label: 'Encrypted' },
                  { icon: 'finger-print-outline',     label: 'Secure'    },
                  { icon: 'lock-closed-outline',      label: 'Private'   },
                ].map((b) => (
                  <View key={b.label} className="items-center" style={{ gap: 5 }}>
                    <View
                      className="items-center justify-center rounded-xl"
                      style={{
                        width: 36, height: 36,
                        backgroundColor: '#070f1f',
                        borderWidth: 1,
                        borderColor: '#0f2044',
                      }}
                    >
                      <Ionicons name={b.icon} size={15} color="#1e3a5f" />
                    </View>
                    <Text style={{
                      color: '#1e3a5f',
                      fontSize: 9,
                      fontWeight: '700',
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}>
                      {b.label}
                    </Text>
                  </View>
                ))}
              </View>

            </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}