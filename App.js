import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

// Store data in json files (can also be retrieved from other sources)
import restaurantData from './assets/restaurantData.json';

// get screen dimensions for responsive elements
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// Navigators.
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * This is needed because we need to use static images for the project instead
 * of fetching from the network dynamically.
 */
const imageMap = {
  "ice-cream-header.jpg": require("./assets/images/ice-cream-header.jpg"),
  "indulge-in-a-spectacular.jpg": require("./assets/images/indulge-in-a-spectacular.jpg"),
  "martini-house.jpg": require("./assets/images/martini-house.jpg"),
};

/**
 * main app
 */
export default function App() {
  // keep favourites in state to allow for dynamic updates.
  const [userFavourites, setUserFavourites] = useState([]);

  /**
   * Load dynamic state from storage so that state
   * persists when the app is re-launched.
   */
  const getFavouriteState = async () => {
    try {
      const storedFavourite = await AsyncStorage.getItem("userFavourites");
      if (storedFavourite !== null) {
        setUserFavourites(JSON.parse(storedFavourite)); // Parse and set the state
      }
    } catch (error) {
      console.error("Error reading value from AsyncStorage", error);
    }
  };

  /**
   * Store the dynamic state so that state
   * persistes when the app is re-launched.
   */
  const setFavouriteState = async (userFavourires) => {
    try {
      await AsyncStorage.setItem(
        "userFavourites",
        JSON.stringify(userFavourires)
      ); // Store as string
    } catch (error) {
      console.error("Error saving value to AsyncStorage", error);
    }
  };

  /**
   * Add/Remove retaurantIds from the user favourites list.
   */
  const toggleFavourite = (id) => {
    let updatedFavourites;
    if (!userFavourites.includes(id)) {
      // Add to favourites
      updatedFavourites = [...userFavourites, id];
    } else {
      // Remove from favourites
      updatedFavourites = userFavourites.filter((favId) => favId !== id);
    }
    setUserFavourites(updatedFavourites); // update dynamic state.
    setFavouriteState(updatedFavourites); // Persist user favourites when changed.
  };

  // Fetch the stored favourite state when app is starting.
  useEffect(() => {
    getFavouriteState();
  }, []);

  /**
   * Restaurant cell showing data for one restaurant
   */
  const RestaurantTableCell = (props) => (
    <Cell
      {...props}
      contentContainerStyle={{
        height: props.height,
        backgroundColor: "transparent",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 25,
      }}
      highlightUnderlayColor="#ccc"
      cellContentView={
        <View style={{ width: "100%" }}>
          <Image
            style={styles.restaurantImage}
            source={imageMap[props.imgUri]}
          />
          <TouchableOpacity
            onPress={() => {
              toggleFavourite(props.id);
            }}
            style={styles.favButton}
          >
            <FontAwesome
              name={userFavourites.includes(props.id) ? "heart" : "heart-o"} // Filled star if it's a favourite
              size={HEIGHT / 25}
              color="red"
            />
          </TouchableOpacity>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>{props.eta}</Text>
            <Text style={styles.etaText}>mins</Text>
          </View>
          <Text style={styles.restaurantTitleText}>{props.title}</Text>
          <Text style={styles.restaurantSubtitleText}>{props.tagline}</Text>
        </View>
      }
      onPress={props.action}
    />
  );

  /**
   * Table of restaurants
   */
  function RestaurantTable(props) {
    return (
      <TableView>
        <Section header="" separatorTintColor="#ccc">
          {/* create cell for each restaurant */}
          {props.data.map((r, i) => (
            <RestaurantTableCell
              key={i}
              id={r.id}
              title={r.title}
              tagline={r.tagline}
              eta={r.eta}
              imgUri={r.imgUri}
              height={r.height}
              action={() => {
                props.nav.navigate("Menu", r.items);
              }}
            />
          ))}
        </Section>
      </TableView>
    );
  }

  /**
   * Restaurant screen showing list of restaurants
   */
  function RestaurantScreen({ navigation, route }) {

    const [dataToShow, setDataToShow] = useState(restaurantData);
    useEffect(() => {
      const filteredData = route.params.favouritesOnly
        ? restaurantData.filter((restaurant) =>
            userFavourites.includes(restaurant.id)
          )
        : restaurantData;
      setDataToShow(filteredData);
    }, [userFavourites]);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContentView}>
          <ScrollView>
            <RestaurantTable nav={navigation} data={dataToShow} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Stack navigator to navigate to restaurant menu and back
   */
  function RestaurantScreenNavigator({ route, favouritesOnly = false }) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Restaurants"
          component={RestaurantScreen}
          options={{ presentation: "modal", gestureEnabled: true }}
          initialParams={{ favouritesOnly }}
        />
        <Stack.Screen
          name="Menu"
          options={{ presentation: "modal", gestureEnabled: true }}
          component={MenuScreen}
        />
      </Stack.Navigator>
    );
  }


  /**
   * Menu items screen for each restaurant
   */
  function MenuScreen({ route, navigation }) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContentView}>
          <ScrollView>
            <TableView>
              {/* create header for each menu section */}
              {route.params.map((section, i) => (
                <Section
                  header={section.title}
                  hideSeparator="true"
                  separatorTintColor="#ccc"
                  key={i}
                >
                  {/* list items in each section */}
                  {section.contents.map((item, i) => (
                    <Cell key={i}>
                      <Text key={i}>{item.title}</Text>
                    </Cell>
                  ))}
                </Section>
              ))}
            </TableView>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // main tab navigation container
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="RestaurantsTab"
          children={() => <RestaurantScreenNavigator favouritesOnly={false} />}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Favourites"
          children={() => <RestaurantScreenNavigator favouritesOnly={true} />}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// css styles for app elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentView: {
    flex: 15,
  },
  etaBadge: {
    backgroundColor: "white",
    height: HEIGHT / 12,
    width: WIDTH / 3.5,
    borderRadius: WIDTH / 3 / 2,
    justifyContent: "center",
    position: "absolute",
    top: "65%",
    right: "5%",
    borderWidth: "1",
    borderColor: "#ccc",
  },
  etaText: {
    color: "black",
    textAlign: "center",
    fontSize: HEIGHT / 45,
    fontWeight: "bold",
  },
  restaurantImage: {
    width: "100%",
    borderRadius: "2%",
    height: "80%",
  },
  restaurantTitleText: {
    paddingTop: 15,
    fontSize: HEIGHT / 38,
    fontWeight: "bold",
  },
  restaurantSubtitleText: {
    paddingTop: 15,
    fontSize: HEIGHT / 60,
  },
  favButton: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingRight: "4%",
    paddingTop: "4%"
  },
});
