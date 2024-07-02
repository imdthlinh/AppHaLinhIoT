import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {home} from '../ControlApp-main/assets/image';
import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const App = () => {
  const [setting, setControl] = useState('');
  const [displayText, setDisplayText] = useState('');
  const supabaseUrl = 'https://atamzgfzgyynoqqdnbup.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YW16Z2Z6Z3l5bm9xcWRuYnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyOTg0NDEsImV4cCI6MjAzNDg3NDQ0MX0.Ner2Wvuop0mILVgNkhI_Q0_XNgzC32pKRTkAhQlWA2I';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: false,
    },
  });

  const fetchData = async () => {
    const {data, error} = await supabase
      .schema('public')
      .from('humidity')
      .select('*')
      .order('id', {ascending: false})
      .limit(1);

    if (error) {
      console.error(error);
    } else {
      console.log('Data', data);
      setDisplayText(`${data[0].value}°C`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeTemperature = async (temperature: number) => {
    const {data, error} = await supabase
      .from('humidity')
      .insert([{value: temperature}])
      .select();

    if (!!data) {
      console.log('dataCHange', data);
      Alert.alert('success');
    }
  };
  const handleSettingInput = (text: React.SetStateAction<string>) => {
    setControl(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${setting}%`);
    changeTemperature(Number(setting));
  };

  return (
    <ImageBackground
      source={require('../ControlApp-main/assets/image/Home.png')}
      style={styles.container}
      imageStyle={{
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
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
    textAlign: 'center',
  },
  textdisplay: {
    fontSize: 20,
    color: 'black',
    marginTop: 450,
    marginRight: 20,
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
    fontSize: 18,
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
