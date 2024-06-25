import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/image/const';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleTemperatureInput = (text: React.SetStateAction<string>) => {
    setTemperature(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${temperature}%`);
  };
  const goToFanScreen = () => {
    navigation.navigate('DeviceScreen' as never);
  };

  return (
    <ImageBackground
      source={require('../../assets/image/Home.png')}
      style={styles.container}
      imageStyle={{
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      }}>

      <SafeAreaView style={styles.container}>
        <Text style={styles.textdisplay}>
          Xin chào, Vui lòng nhập độ ẩm
        </Text>
        <View style={styles.circle}>
          <Text style={styles.circleText}>{displayText || '0%'}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleTemperatureInput}
            value={temperature}
            placeholder="Nhập độ ẩm %"
            keyboardType="numeric"
          />
          <View style={{ gap: 10 }}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Nhập dữ liệu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToFanScreen}>
              <Text style={styles.buttonText}>Thiết bị</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 52,
    width: 141,
    margin: 12,
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: '#93D6EF',
    padding: 10,
    alignSelf: 'center',
    textAlign: 'center'
  },
  textdisplay: {
    fontSize: 20,
    color: 'black',
    marginTop: 450,
    marginRight: 60
  },
  button: {
    backgroundColor: '#93D6EF',
    padding: 13,
    borderRadius: 25,
    width: 308,
    height: 52,
    marginLeft: 12,
    gap: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18
  },
  circle: {
    marginTop: 30,
    backgroundColor: '#fed269',
    borderRadius: 20,
    width: 141,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
  },
  circleText: {
    fontSize: 28,
    color: 'black',
  },
});



export default HomeScreen;
