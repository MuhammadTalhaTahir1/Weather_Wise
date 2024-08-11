import AsyncStorage from "@react-native-async-storage/async-storage";
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("data stored");
  } catch (error) {
    console.log("error storing data", error);
  }
};
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.log("error storing data", error);
  }
};
