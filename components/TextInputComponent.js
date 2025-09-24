import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function TextInputComponent({ label, placeholder, value, onChangeText, secureTextEntry = false }){
    return(
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
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
        color: '#222',
        marginLeft: 2,
    },
    input: {
        height: 48,
        borderColor: '#007AFF',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 14,
        backgroundColor: '#F8F9FB',
        fontSize: 16,
        color: '#222',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 2,
        elevation: 1,
    },
});