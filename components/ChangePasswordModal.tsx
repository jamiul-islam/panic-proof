import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { X, Lock, Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacings } from '@/constants/spacings';
import Button from '@/components/Button';
import IconWrapper from '@/components/IconWrapper';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordModal({ visible, onClose, onSuccess }: ChangePasswordModalProps) {
  const { user } = useUser();
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsLoading(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const validateForm = () => {
    if (!currentPassword.trim()) {
      setError('Please enter your current password');
      return false;
    }
    if (!newPassword.trim()) {
      setError('Please enter your new password');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };
  
  // Update the user's password using Clerk's user.updatePassword method
  const handleUpdatePassword = async () => {
    if (!user || !validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await user.updatePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        signOutOfOtherSessions: false, // Keep user signed in on other devices
      });
      
      Alert.alert(
        'Success!',
        'Your password has been successfully changed.',
        [
          {
            text: 'OK',
            onPress: () => {
              handleClose();
              onSuccess?.();
            }
          }
        ]
      );
    } catch (err: any) {
      let errorMessage = 'Failed to update password. Please try again.';
      
      // Handle specific Clerk error cases
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === 'form_password_incorrect') {
          errorMessage = 'Current password is incorrect';
        } else if (clerkError.code === 'form_password_pwned') {
          errorMessage = 'This password has been found in a data breach. Please choose a different password.';
        } else if (clerkError.code === 'form_password_size_in_bytes_exceeded') {
          errorMessage = 'Password is too long. Please choose a shorter password.';
        } else if (clerkError.message) {
          errorMessage = clerkError.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Change Password</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconWrapper icon={X} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Enter your current password and choose a new password.
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <IconWrapper icon={Lock} size={20} color={colors.textTertiary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <IconWrapper 
                icon={showCurrentPassword ? EyeOff : Eye} 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <IconWrapper icon={Lock} size={20} color={colors.textTertiary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <IconWrapper 
                icon={showNewPassword ? EyeOff : Eye} 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <IconWrapper icon={Lock} size={20} color={colors.textTertiary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <IconWrapper 
                icon={showConfirmPassword ? EyeOff : Eye} 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          
          <Button
            title="Change Password"
            onPress={handleUpdatePassword}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.button}
          />
          
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacings.screenPadding,
    paddingTop: spacings.xxl,
    paddingBottom: spacings.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  title: {
    fontSize: spacings.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: spacings.xs,
  },
  content: {
    flex: 1,
    padding: spacings.screenPadding,
  },
  subtitle: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacings.xxl,
    textAlign: 'center',
    lineHeight: spacings.fontSize.md * 1.4,
  },
  errorText: {
    color: colors.danger,
    fontSize: spacings.fontSize.sm,
    marginBottom: spacings.lg,
    textAlign: 'center',
    backgroundColor: colors.dangerBackground,
    padding: spacings.md,
    borderRadius: spacings.borderRadius.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacings.borderRadius.sm,
    marginBottom: spacings.lg,
    backgroundColor: colors.inputBackground,
  },
  iconContainer: {
    paddingHorizontal: spacings.md,
  },
  input: {
    flex: 1,
    height: spacings.heights.input,
    fontSize: spacings.fontSize.md,
    color: colors.text,
    paddingRight: spacings.md,
  },
  eyeButton: {
    paddingHorizontal: spacings.md,
  },
  button: {
    marginBottom: spacings.xxl,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacings.md,
  },
  cancelText: {
    fontSize: spacings.fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});