import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {home} from "../ControlApp-main/assets/image";

const App = () => {
  const [setting, setControl] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleSettingInput = (text: React.SetStateAction<string>) => {
    setControl(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${setting}%`);
  };

  return (
    <ImageBackground
      source={require('../ControlApp-main/assets/image/Home.png')}
      style={styles.container}
      imageStyle={{
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      }}>
        <SafeAreaView style={styles.container}>
      <Text style={styles.textdisplay}>
        Nhập ngưỡng độ ẩm để bật tắt thiết bị
      </Text>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{displayText || '0%'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleSettingInput}
          value={setting}
          placeholder="Nhập ngưỡng độ ẩm"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
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
    // paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 52,
    width: 150,
    margin: 18,
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
    marginRight: 20
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
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
  },
  circleText: {
    fontSize: 28,
    color: 'black',
  },
});

export default App;
