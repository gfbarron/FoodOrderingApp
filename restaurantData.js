// Define data in another file to save space in App.js
export const restaurantData = [
  {
    title: "Joe's Gelato",
    tagline: "Desert, Ice cream, $",
    eta: "10-30",
    imgUri: require("./assets/images/ice-cream-header.jpg"),
    height: 240,
    items: [
      {
        title: "Gelato",
        contents: [
          { title: "Vanilla" },
          { title: "Chocolate" },
          { title: "Mint" },
        ],
      },
      {
        title: "Coffee",
        contents: [
          { title: "Flat white" },
          { title: "Latte" },
          { title: "Caffe Americano" },
        ],
      },
    ],
  },
  {
    title: "Martini House",
    tagline: "Italian cuisine, fine wine and cocktails, $$",
    eta: "50+",
    imgUri: require("./assets/images/martini-house.jpg"),
    height: 240,
    items: [
      {
        title: "Dinner",
        contents: [
          { title: "Butcher's Block" },
          { title: "Roast Chicken" },
          { title: "Stuffed Butternut Squash" },
        ],
      },
      {
        title: "Martini's",
        contents: [
          { title: "Left Hook" },
          { title: "Money Maker" },
          { title: "Bourbon Time" },
        ],
      },
    ],
  },
  {
    title: "La Capannina",
    tagline: "Authentic italian cuisine, $$$",
    eta: "30-40",
    imgUri: require("./assets/images/indulge-in-a-spectacular.jpg"),
    height: 240,
    items: [
      {
        title: "Mangiamo",
        contents: [
          { title: "Red Pepper Penne" },
          { title: "Spaghetti Bolognese" },
          { title: "White Truffle Risotto" },
        ],
      },
      {
        title: "Vino Rosso",
        contents: [
          { title: "Barolo & Barbaresco" },
          { title: "Amarone" },
          { title: "Rosso di Montalcino" },
        ],
      },
    ],
  },
];