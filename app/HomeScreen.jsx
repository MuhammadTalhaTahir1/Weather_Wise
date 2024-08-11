import {
  StatusBar,
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { theme } from "@/constants/Colors";
import {
  MagnifyingGlassIcon,
  PresentationChartBarIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon, CalendarDaysIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "@/constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../async/asynStorage";
const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      storeData("city", loc.name);
      setWeather(data);
      setLoading(false);
      console.log("forecast Data", data);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        console.log("got Location", data);
        setLocations(data);
      });
    }
    console.log("value", value);
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);
  const { current, location } = weather;

  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    console.log(myCity);
    let cityName = "Lahore";
    if (myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="#000000" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        style={styles.img}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Progress.CircleSnail size={140} thickness={10} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView style={styles.safeContainer}>
          {/* search section */}
          <View style={styles.searchOuter}>
            <View
              style={[
                styles.search,
                {
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : "transparent",
                },
              ]}
            >
              {showSearch ? (
                <TextInput
                  placeholder="Search city"
                  placeholderTextColor={"white"}
                  style={styles.searchText}
                  onChangeText={handleTextDebounce}
                />
              ) : null}

              <TouchableOpacity
                style={styles.searchIcon}
                onPress={() => toggleSearch(!showSearch)}
              >
                <MagnifyingGlassIcon size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View
                style={{
                  position: "absolute",
                  top: 64,
                  borderRadius: 24,
                  width: "100%",
                  backgroundColor: "#d1d5db",
                }}
              >
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let border = {
                    borderBottomWidth: 2,
                    borderBottomColor: "#9CA3AF",
                  };
                  let borderClass = showBorder ? border : "";
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          borderWidth: 0,
                          padding: 12,
                          paddingHorizontal: 16,
                          marginBottom: 4,
                        },
                        borderClass,
                      ]}
                    >
                      <MapPinIcon size={20} color="black" />
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: 18,
                          marginLeft: 8,
                        }}
                      >
                        {loc?.name},{loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* forecast section */}
          <View
            style={{
              marginHorizontal: 16,
              flex: 1,
              justifyContent: "space-around",
              marginBottom: 8,
            }}
          >
            {/* location */}
            <Text
              style={{
                color: "#ffff",
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {location?.name}
              <Text
                style={{ color: "#D1D5DB", fontSize: 18, fontWeight: "600" }}
              >
                {/* {", " + location.country} */}
              </Text>
            </Text>
            {/* weather Image */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Image
                // source={{uri:"https:"+current?.condition?.icon}}  its the icon from the api but its so blury, so intead we use our own icon intead
                // source={require("../assets/images/partlycloudy.png")}
                source={weatherImages[current?.condition?.text]}
                style={{ width: 200, height: 200, justifyContent: "center" }}
              />
            </View>
            {/* degree celcious */}
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 48,
                  textAlign: "center",
                }}
              >
                {current?.temp_c}&#176;
              </Text>
              <Text
                style={{
                  color: "#fff",
                  letterSpacing: 1.5,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {current?.condition?.text}
              </Text>
            </View>
            {/* other stats */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 24, width: 24 }}
                  source={require("../assets/icons/wind.png")}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 16,
                    marginLeft: 5,
                  }}
                >
                  {current?.wind_kph + " "}km
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 24, width: 24 }}
                  source={require("../assets/icons/drop.png")}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 16,
                    marginLeft: 5,
                  }}
                >
                  {current?.humidity}%
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 24, width: 24 }}
                  source={require("../assets/icons/sun.png")}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 16,
                    marginLeft: 5,
                  }}
                >
                  {weather?.forecast?.forecastday[0]?.astro.sunrise}
                </Text>
              </View>
            </View>
          </View>
          {/* forecast for next days */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 20,
                marginBottom: 12,
              }}
            >
              <CalendarDaysIcon size={25} color="white" />
              <Text style={{ color: "#fff", fontSize: 16, marginLeft: 8 }}>
                Daily Forecast
              </Text>
            </View>
            {/* for next days weather */}
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 15,
                marginBottom: 10,
              }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 96,
                      borderRadius: 24,
                      backgroundColor: theme.bgWhite(0.15),
                      paddingVertical: 12,
                      marginLeft: 10,
                    }}
                  >
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      style={{ width: 44, height: 44 }}
                    />
                    <Text style={{ color: "#fff" }}>{item?.date}</Text>
                    <Text
                      style={{ color: "#fff", fontWeight: "600", fontSize: 20 }}
                    >
                      {" "}
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  img: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  safeContainer: {
    flex: 1,
  },
  searchOuter: {
    height: "7%",
    margin: 16,
    position: "relative",
    zIndex: 50,
  },
  search: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 100,
  },
  searchText: {
    paddingLeft: 24,
    flex: 1,
    fontSize: 16,
    color: "white",
    height: 40,
  },
  searchIcon: {
    backgroundColor: theme.bgWhite(0.3),
    borderRadius: 100,
    padding: 12,
    margin: 4,
  },
});
