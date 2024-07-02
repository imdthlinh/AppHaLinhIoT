import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images} from '../../assets/image/const';
import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {Weather} from './weather';
import moment from 'moment';
import {PERMISSIONS, request} from 'react-native-permissions';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [temperatureToOpenFan, setTemperatureToOpenFan] = useState('');
  const [position, setPosition] = useState<Geolocation.GeoPosition>();
  const [weather, setWeather] = useState<
    Array<{
      time: string;
      temperature: number;
    }>
  >();
  const [currentWeather, setCurrentWeather] = useState<{
    time: string;
    temperature: number;
  }>();
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

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    handleCalculateCurrentTemperature();
  }, [weather]);

  const getWeather = async (lat: number, long: number) => {
    const params = {
      latitude: lat,
      longitude: long,
      hourly: 'relative_humidity_2m',
      forecast_days: 1,
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    try {
      const responses = await axios.get(url, {
        params,
      });
      const res = responses.data as Weather;
      const data: Array<{
        time: string;
        temperature: number;
      }> = [];
      res.hourly.time.forEach((item, index) => {
        data.push({
          time: moment(item).format('HH:mm'),
          temperature: res.hourly.relative_humidity_2m[index],
        });
      });
      return data;
    } catch (error) {
      console.table('err', error);
    }
  };

  const handleCalculateCurrentTemperature = async () => {
    let currentHours = moment().hours();
    let currentMinutes = moment().minutes();
    const hours =
      currentMinutes > 30 ? `${currentHours + 1}:00` : `${currentHours}:00`;
    const currentTemp = weather?.find(item => item.time === hours);
    if (!!currentTemp) {
      setDisplayText(currentTemp?.temperature.toString() + '%');
      setCurrentWeather(currentTemp as any);
    }
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await requestLocationPermission();
    } else {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        console.log('result', result);
      });
    }

    Geolocation.getCurrentPosition(
      async position => {
        console.log(position);
        setPosition(position);
        const weather = await getWeather(
          position.coords.latitude,
          position.coords.longitude,
        );
        console.log('weather', weather);
        setWeather(weather);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleGotoChart = () => {
    const chartData: Array<any> = [];
    weather?.forEach((item, index) => {
      if (
        index === 0 ||
        index === 4 ||
        index === 8 ||
        index === 12 ||
        index === 16 ||
        index === 20 ||
        index === 23
      ) {
        chartData.push(item);
      }
    });
    navigation.navigate('Chart', {
      currentWeather: currentWeather,
      weather: weather,
      chartData: chartData,
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
              <TouchableOpacity style={styles.button} onPress={handleGotoChart}>
                <Text style={styles.buttonText}>Chart</Text>
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
