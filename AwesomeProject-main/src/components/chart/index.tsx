import {useRoute} from '@react-navigation/native';
import {Dimensions, FlatList, SafeAreaView, Text, View} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
export const Chart = () => {
  const route = useRoute();
  const params = route.params as any;
  const chartDart = params?.chartData || [];
  const indexOfCurrent = params?.weather?.findIndex(
    (item: any) => item.time === params?.currentWeather?.time,
  );
  const weather = params?.weather?.slice(indexOfCurrent) || [];

  return (
    <SafeAreaView
      style={{
        gap: 20,
      }}>
      <View>
        <Text>Humidity Line Chart</Text>
        <LineChart
          data={{
            labels: chartDart.map((item: any) => item.time),
            datasets: [
              {
                data: chartDart.map((item: any) => item.temperature),
                strokeWidth: 2,
              },
            ],
          }}
          width={Dimensions.get('window').width - 10} // from react-native
          height={300}
          // yAxisLabel="$"
          yAxisSuffix="%"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: 'center',
          }}
        />
      </View>

      <FlatList
        data={weather}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 10,
        }}
        renderItem={({item, index}) => (
          <View style={{padding: 5, borderWidth: 1}}>
            <Text>{index === 0 ? 'Now' : item.time}</Text>

            <Text>{item.temperature}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
