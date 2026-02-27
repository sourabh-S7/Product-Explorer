import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardSlide = useRef(new Animated.Value(60)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(cardSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    let valid = true;
    if (!username.trim()) {
      setUsernameError('Username is required.');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1500);
  };

  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'WEAK', color: '#ef4444', bars: 1 };
    if (password.length < 8) return { label: 'FAIR', color: '#f59e0b', bars: 2 };
    if (password.length < 12) return { label: 'GOOD', color: '#22c55e', bars: 3 };
    return { label: 'STRONG', color: '#22c55e', bars: 4 };
  };

  const strength = getStrength();

  return (
    // FIX: KeyboardAvoidingView must be the ROOT wrapper — before SafeAreaView
    // This is the correct order that makes keyboard work on both iOS and Android
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Glow blobs */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ position: 'absolute', top: -100, left: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: '#1d4ed8', opacity: 0.20 }} />
        <View style={{ position: 'absolute', bottom: 80, right: -100, width: 260, height: 260, borderRadius: 130, backgroundColor: '#3b82f6', opacity: 0.13 }} />
        <View style={{ position: 'absolute', top: '42%', left: '25%', width: 220, height: 220, borderRadius: 110, backgroundColor: '#2563eb', opacity: 0.08 }} />
      </View>

      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 36, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          {/* ── Logo + Heading ── */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} className="mb-8">

            <Animated.View style={{ transform: [{ scale: logoScale }] }} className="mb-7 self-start">
              <View style={{
                width: 68, height: 68, borderRadius: 20,
                backgroundColor: '#0f172a', borderWidth: 1.5, borderColor: '#3b82f6',
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7, shadowRadius: 18, elevation: 12,
              }}>
                <Text style={{ fontSize: 32 }}>🛍️</Text>
              </View>
            </Animated.View>

            <Text style={{ fontSize: 38, fontWeight: '900', color: '#ffffff', lineHeight: 44, letterSpacing: -0.8 }}>
              Welcome{'\n'}
              <Text style={{ color: '#3b82f6' }}>Back.</Text>
            </Text>
            <Text className="text-zinc-500 mt-2 text-sm">
              Sign in to explore amazing products
            </Text>
          </Animated.View>

          {/* ── Card ── */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: cardSlide }] }}>
            <View style={{
              backgroundColor: '#0a0a0a', borderRadius: 28, padding: 24,
              borderWidth: 1, borderColor: '#1c1c1c',
              shadowColor: '#000', shadowOffset: { width: 0, height: 24 },
              shadowOpacity: 0.7, shadowRadius: 32, elevation: 18,
            }}>

              {/* ── Username ── */}
              <View className="mb-4">
                <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 8 }}>
                  Username
                </Text>

                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: '#141414', borderRadius: 14, borderWidth: 1.5,
                  borderColor: usernameError ? '#ef4444' : usernameFocused ? '#3b82f6' : '#242424',
                  paddingHorizontal: 14,
                  shadowColor: usernameError ? '#ef4444' : usernameFocused ? '#3b82f6' : 'transparent',
                  shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 10,
                }}>
                  <Text style={{ fontSize: 16, marginRight: 10, opacity: usernameFocused ? 1 : 0.45 }}>👤</Text>
                  <TextInput
                    className="flex-1 text-sm"
                    style={{ paddingVertical: 14, color: '#f4f4f5' }}
                    placeholder="Enter your username"
                    placeholderTextColor="#3f3f46"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={username}
                    onChangeText={(text) => { setUsername(text); if (usernameError) setUsernameError(''); }}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                  {username.length > 0 && (
                    <TouchableOpacity onPress={() => setUsername('')} className="pl-2">
                      <Text className="text-zinc-600 text-base">✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {usernameError ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">⚠ {usernameError}</Text>
                ) : null}
              </View>

              {/* ── Password ── */}
              <View className="mb-2">
                <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 8 }}>
                  Password
                </Text>

                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: '#141414', borderRadius: 14, borderWidth: 1.5,
                  borderColor: passwordError ? '#ef4444' : passwordFocused ? '#3b82f6' : '#242424',
                  paddingHorizontal: 14,
                  shadowColor: passwordError ? '#ef4444' : passwordFocused ? '#3b82f6' : 'transparent',
                  shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 10,
                }}>
                  <Text style={{ fontSize: 16, marginRight: 10, opacity: passwordFocused ? 1 : 0.45 }}>🔒</Text>
                  <TextInput
                    ref={passwordRef}
                    className="flex-1 text-sm"
                    style={{ paddingVertical: 14, color: '#f4f4f5' }}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#3f3f46"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    value={password}
                    onChangeText={(text) => { setPassword(text); if (passwordError) setPasswordError(''); }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-2 py-1">
                    <Text style={{ color: '#3b82f6', fontWeight: '700', fontSize: 11, letterSpacing: 0.8 }}>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {passwordError ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">⚠ {passwordError}</Text>
                ) : null}

                {/* Strength meter */}
                {strength && !passwordError && (
                  <View className="flex-row items-center mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={{
                          flex: 1, height: 3, borderRadius: 2,
                          marginRight: i < 4 ? 4 : 0,
                          backgroundColor: i <= strength.bars ? strength.color : '#242424',
                        }}
                      />
                    ))}
                    <Text style={{ color: strength.color, fontSize: 10, fontWeight: '700', marginLeft: 8, letterSpacing: 0.5 }}>
                      {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end mt-3 mb-5 py-1">
                <Text style={{ color: '#3b82f6', fontSize: 12, fontWeight: '600' }}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
                style={{
                  borderRadius: 14, paddingVertical: 15,
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'row',
                  backgroundColor: loading ? '#1e3a8a' : '#2563eb',
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: loading ? 0.2 : 0.55,
                  shadowRadius: 16, elevation: 12,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.4 }}>Sign In</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginLeft: 8 }}>→</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1" style={{ height: 1, backgroundColor: '#1c1c1c' }} />
                <Text style={{ marginHorizontal: 14, color: '#3f3f46', fontSize: 10, letterSpacing: 1.2, fontWeight: '600' }}>
                  OR CONTINUE WITH
                </Text>
                <View className="flex-1" style={{ height: 1, backgroundColor: '#1c1c1c' }} />
              </View>

              {/* Social Buttons */}
              <View className="flex-row">
                {[{ label: 'Apple', icon: '🍎' }, { label: 'Google', icon: '🌐' }].map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.7}
                    style={{
                      flex: 1, flexDirection: 'row',
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: '#141414',
                      borderWidth: 1, borderColor: '#242424',
                      borderRadius: 14, paddingVertical: 13,
                      marginRight: index === 0 ? 12 : 0,
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>{item.icon}</Text>
                    <Text style={{ color: '#a1a1aa', fontWeight: '600', fontSize: 13, marginLeft: 8 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </View>
          </Animated.View>

          {/* Sign Up */}
          <Animated.View style={{ opacity: fadeAnim }} className="flex-row justify-center mt-6">
            <Text className="text-zinc-600 text-sm">Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ color: '#3b82f6', fontWeight: '700', fontSize: 13 }}>Create Account</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Terms */}
          <Animated.View style={{ opacity: fadeAnim }} className="items-center mt-4">
            <Text className="text-zinc-700 text-xs text-center" style={{ lineHeight: 17 }}>
              By signing in, you agree to our{' '}
              <Text className="text-zinc-500 font-semibold">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-zinc-500 font-semibold">Privacy Policy</Text>
            </Text>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}