import React, { useEffect, useState, useCallback } from "react";
import { Alert, Switch, Text, View, Button, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Notificaciones from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from '../../components/TextInputComponent';
import api from '../../Src/Services/Conexion';

export default function ConfiguracionScreen(){

    const [permisoNotificaciones, setPermisoNotificaciones] = useState(false);
    const [loading, setLoading] = useState(true);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    const checkPermisos = async ()=>{
        const {status} = await Notificaciones.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas')
        setPermisoNotificaciones(status === 'granted' && preferencia === 'true')
        setLoading(false);
    }

    useEffect(()=>{
        checkPermisos();
    },[]);

    useFocusEffect(
        useCallback(() => {
            checkPermisos();
        }, [])
    );


    const toggleSwitch = async (valor)=>{
        if(valor){
            const {status} = await Notificaciones.requestPermissionsAsync();
            if(status === 'granted'){
                await AsyncStorage.setItem('notificaciones_activas','true')
                setPermisoNotificaciones(true);
            }else{
                await AsyncStorage.setItem('notificaciones_activas','false')
            }
        }else{
            await AsyncStorage.setItem('notificaciones_activas','false')
            setPermisoNotificaciones(false);
            Alert.alert("Notificaciones desactivadas");
        }
    }

    const handlePasswordInputChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordForm.currentPassword.trim()) {
            errors.currentPassword = 'La contraseña actual es obligatoria';
        }

        if (!passwordForm.newPassword.trim()) {
            errors.newPassword = 'La nueva contraseña es obligatoria';
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordForm.newPassword)) {
            errors.newPassword = 'La contraseña debe contener mayúscula, minúscula, número y símbolo';
        }

        if (!passwordForm.confirmPassword.trim()) {
            errors.confirmPassword = 'La confirmación es obligatoria';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) return;

        setChangingPassword(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert('Error', 'No hay token de autenticación');
                return;
            }

            const response = await api.post("api/change-password", {
                current_password: passwordForm.currentPassword,
                password: passwordForm.newPassword,
                password_confirmation: passwordForm.confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            Alert.alert('Éxito', 'Contraseña cambiada exitosamente');
            // Clear form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            if (error.response?.data?.errors) {
                // Handle field-specific errors from backend
                const fieldErrors = {};
                Object.keys(error.response.data.errors).forEach(key => {
                    fieldErrors[key] = error.response.data.errors[key][0]; // Take first error message
                });
                setPasswordErrors(fieldErrors);
            } else {
                Alert.alert('Error', error.response?.data?.message || 'Error al cambiar la contraseña');
            }
        } finally {
            setChangingPassword(false);
        }
    };

    const programarNotificacion = async ()=>{
        const { status } = await Notificaciones.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas')

        if(status !== 'granted' || preferencia !== 'true'){
            Alert.alert("No tienes los permisos necesarios para recibir notificaciones")
            return;
        }

        const trigger = new Date(Date.now() + 1 * 60 *1000)//1 minuto

        try {
            await Notificaciones.scheduleNotificationAsync({
                content:{
                    title:"uh uh temu!!",
                    body:"Felicidades🎉 Ganaste un iphone"
                },
                trigger
            });
            Alert.alert("Felicidades🎉 Ganaste un iphone")
        }catch(e){
            Alert.alert("error al programar la notificacion")
        }
    }

    return(
        <ScrollView style={{flex:1, backgroundColor: '#f5f5f5'}}>
            <View style={{padding: 20}}>
                {/* Header */}
                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <Ionicons name="settings" size={60} color="#0c82eaff" />
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10}}>
                        Configuración
                    </Text>
                </View>

                {/* Notificaciones Section */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                }}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15}}>
                        Notificaciones
                    </Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: '#666'}}>
                            Notificaciones: {permisoNotificaciones ? 'Activadas' : 'Desactivadas'}
                        </Text>
                        <Switch value={permisoNotificaciones} onValueChange={toggleSwitch}/>
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#28a745',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            marginTop: 15,
                            alignItems: 'center'
                        }}
                        onPress={programarNotificacion}
                    >
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
                            Probar Notificación
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Change Password Section */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                }}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15}}>
                        Cambiar Contraseña
                    </Text>

                    <TextInputComponent
                        placeholder="Contraseña actual"
                        value={passwordForm.currentPassword}
                        onChangeText={(value) => handlePasswordInputChange('currentPassword', value)}
                        error={passwordErrors.currentPassword}
                        leftIcon="lock-closed"
                        secureTextEntry
                    />

                    <TextInputComponent
                        placeholder="Nueva contraseña"
                        value={passwordForm.newPassword}
                        onChangeText={(value) => handlePasswordInputChange('newPassword', value)}
                        error={passwordErrors.newPassword}
                        leftIcon="lock-closed"
                        secureTextEntry
                    />

                    <TextInputComponent
                        placeholder="Confirmar nueva contraseña"
                        value={passwordForm.confirmPassword}
                        onChangeText={(value) => handlePasswordInputChange('confirmPassword', value)}
                        error={passwordErrors.confirmPassword}
                        leftIcon="lock-closed"
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: changingPassword ? '#ccc' : '#0c82eaff',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 15,
                            borderRadius: 8,
                            marginTop: 20
                        }}
                        onPress={handleChangePassword}
                        disabled={changingPassword}
                    >
                        {changingPassword ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="key" size={20} color="#fff" />
                                <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10}}>
                                    Cambiar Contraseña
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}