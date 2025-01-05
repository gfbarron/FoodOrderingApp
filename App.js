import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PixelRatio,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

// icons
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// Store data in json files (can also be retrieved from other sources)
import restaurantData from "./assets/restaurantData.json";

// get screen dimensions for responsive elements
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
// Navigators.
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * This is needed because we need to use static images for the project instead
 * of fetching from the network dynamically.
 *
 * Images are re-used across restaurants to save space for this project.
 */
const imageMap = {
  "ice-cream-header.jpg": require("./assets/images/ice-cream-header.jpg"),
  "indulge-in-a-spectacular.jpg": require("./assets/images/indulge-in-a-spectacular.jpg"),
  "martini-house.jpg": require("./assets/images/martini-house.jpg"),
  "vanilla.jpg": require("./assets/images/vanilla.jpg"),
  "mint.jpg": require("./assets/images/mint.jpg"),
  "chocolate.jpg": require("./assets/images/chocolate.jpg"),
  "flat-white.jpg": require("./assets/images/flat-white.jpg"),
  "americano.jpg": require("./assets/images/americano.jpg"),
  "latte.jpg": require("./assets/images/latte.jpg"),
  "dinner-item.jpg": require("./assets/images/dinner-item.jpg"),
  "martini.jpg": require("./assets/images/martini.jpg"),
  "wine.jpg": require("./assets/images/wine.jpg"),
  "strauss.jpg": require("./assets/images/strauss.jpg"),
  "beer.jpg": require("./assets/images/beer.jpg"),
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
        height: HEIGHT/4,
        backgroundColor: "transparent",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 25,
        flex: 1
      }}
      highlightUnderlayColor="#ccc"
      cellContentView={
        <View style={{ width: "100%", flex: 1}}>
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
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.etaText}>
              {props.eta}
            </Text>
            <Text style={styles.etaText}>mins</Text>
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.restaurantTitleText}
          >
            {props.title}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.restaurantSubtitleText}
          >
            {props.tagline}
          </Text>
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
   * Represents single item in the Menu screen.
   */
  const MenuItem = ({ children }) => (
    <Cell
      contentContainerStyle={{
        height: HEIGHT / 6, // fixed height for cell
        paddingLeft: 0, // remove default padding
        paddingRight: 0,
        flex: 1, // fill space
        borderBottomWidth: "1",
        borderBottomColor: "#ccc",
        borderBottomLeftRadius: "20%",
        borderBottomRightRadius: "20%",
        marginBottom: "2%",
        paddingBottom: "5%",
      }}
      cellContentView={
        <View
          style={{
            flex: 1, // fill space
            padding: 0, // remove default padding
            margin: 0,
            flexDirection: "row", // split vertically
          }}
        >
          <View style={styles.menuItemTextContainer}>
            <Text
              style={styles.menuItemTitleText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {children.title}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.menuItemPriceText}
            >
              {children.price}
            </Text>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              style={styles.menuItemDescriptionText}
            >
              {children.description}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Image
              source={imageMap[children.imgUri]}
              style={styles.menuItemImg}
            />
          </View>
        </View>
      }
    ></Cell>
  );

  /**
   * Menu items screen for each restaurant
   */
  function MenuScreen({ route, navigation }) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContentView}>
          <ScrollView>
            <TableView style={styles.menuTableStyle}>
              {/* create header for each menu section */}
              {route.params.map((section, i) => (
                <Section
                  header={section.title}
                  key={i}
                  hideSeparator="true"
                  separatorTintColor="#ccc"
                  roundedCorners="true"
                  headerTextStyle={{
                    fontSize: HEIGHT / 30,
                    textAlign: "center",
                    paddingBottom: "3%"
                  }}
                >
                  {/* list items in each section */}
                  {section.contents.map((item, i) => (
                    <MenuItem key={i}>{item}</MenuItem>
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
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Restaurants") {
              return (
                <MaterialIcons name="fastfood" size={size} color={color} />
              );
            } else if (route.name === "Favourites") {
              return (
                <FontAwesome5 name="grin-hearts" size={size} color={color} />
              );
            }
          },
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            marginTop: "2%"
          },
          tabBarIconStyle: {
            marginTop: "2%"
          }
        })}
      >
        <Tab.Screen
          name="Restaurants"
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
    height: "30%",
    width: "30%",
    borderRadius: WIDTH / 3 / 2,
    justifyContent: "center",
    borderWidth: "1",
    borderColor: "#ccc",
    position: "absolute",
    alignSelf: "flex-end",
    bottom: "15%",
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
    paddingTop: "10",
    fontSize: HEIGHT / 38,
    fontWeight: "bold",
  },
  restaurantSubtitleText: {
    paddingTop: "5",
    fontSize: HEIGHT / 60,
    fontStyle: "italic",
  },
  favButton: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingRight: "4%",
    paddingTop: "4%",
  },
  menuItemImg: {
    height: "100%",
    width: "70%",
    borderRadius: "50%",
    padding: "3%",
  },
  menuItemTextContainer: {
    flex: 1,
    height: "100%",
    paddingLeft: "2%",
    flexDirection: "column",
  },
  menuItemTitleText: {
    fontSize: HEIGHT / 30,
    flex: 1,
    textAlign: "left",
    textAlignVertical: "bottom",
    paddingTop: "3%",
  },
  menuItemPriceText: {
    fontSize: HEIGHT / 40,
    fontStyle: "italic",
    fontWeight: "300",
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
  },
  menuItemDescriptionText: {
    fontStyle: "italic",
    flex: 1,
    color: "#919090",
  },
  menuTableStyle: { paddingLeft: "3%", paddingRight: "3%" },
});
