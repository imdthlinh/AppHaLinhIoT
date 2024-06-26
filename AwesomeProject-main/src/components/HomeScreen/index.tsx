import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images} from '../../assets/image/const';
import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [temperatureToOpenFan, setTemperatureToOpenFan] = useState('');

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
      setTemperatureToOpenFan(data[0].value);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel('custom-all-channel1')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'humidity'},
        payload => {
          console.log('Change received!', payload);
          fetchData();
        },
      )
      .subscribe();
    return () => {
      channels.unsubscribe();
    };
    // return channels.unsubscribe();
  }, []);
  const handleTemperatureInput = (text: React.SetStateAction<string>) => {
    setTemperature(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${temperature}%`);
  };
  const goToFanScreen = () => {
    navigation.navigate('DeviceScreen' as never, {
      temperatureToOpenFan: temperatureToOpenFan,
      currentTem: temperature,
    });
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
        <View style={{alignSelf: 'flex-end'}}>
          <Text style={styles.textdisplay}>
            Ngưỡng tự độ ẩm tự bật: {temperatureToOpenFan}
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
            <View style={{gap: 10}}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Nhập dữ liệu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={goToFanScreen}>
                <Text style={styles.buttonText}>Thiết bị</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 52,
    width: 300,
    margin: 12,
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: '#93D6EF',
    padding: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  textdisplay: {
    fontSize: 25,
    color: 'black',
    alignSelf: 'center',
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
    backgroundColor: '#fed269',
    borderRadius: 20,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    alignSelf: 'center',
  },
  circleText: {
    fontSize: 28,
    color: 'black',
  },
});

export default HomeScreen;
