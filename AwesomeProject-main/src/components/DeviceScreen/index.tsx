import React, { useState } from 'react';
import { View, Switch, StyleSheet, Image, Text } from 'react-native';
import { images } from '../../assets/image/const';

const DeviceScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Image
        style={styles.deviceImage}
        source={isEnabled ? images.deviceOn : images.device}
      />
      <Switch
        trackColor={{ false: '#828282', true: '#5FE25C' }}
        thumbColor={isEnabled ? 'white' : '#C9C9C9'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={{ paddingTop: 10, fontSize: 20, color: 'black' }}>
        {isEnabled ? 'Dehumidifier is ON' : 'Dehumidifier is OFF'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  deviceImage: {
    width: 400,
    height: 400,
    marginBottom: 100,
  },
});

export default DeviceScreen;
