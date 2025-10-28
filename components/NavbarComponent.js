import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../Src/Services/ThemeContext';

const NavbarComponent = ({title}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.navbar, { backgroundColor: theme.colors.primary }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{width: 24}} />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NavbarComponent;