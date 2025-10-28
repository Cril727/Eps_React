import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Src/Services/ThemeContext';

export default function TextInputComponent({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true
}){
    const { theme } = useTheme();

    return(
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
            <View style={[styles.inputWrapper, error && styles.inputError, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {leftIcon && (
                    <Ionicons name={leftIcon} size={20} color={theme.colors.textSecondary} style={styles.icon} />
                )}
                <TextInput
                    style={[styles.input, leftIcon && styles.inputWithIcon, { color: theme.colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    editable={editable}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 6,
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderWidth: 1.5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: '#dc3545',
    },
    icon: {
        marginLeft: 14,
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
        fontSize: 16,
    },
    inputWithIcon: {
        paddingHorizontal: 10,
    },
    errorText: {
        fontSize: 12,
        color: '#dc3545',
        marginTop: 4,
        marginLeft: 2,
    },
});