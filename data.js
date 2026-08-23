// Hall-14 IIT Kanpur Mess Menu — August 2026
// Structured from the official mess menu sheet.

const PRICES = { breakfast: 55, lunch: 75, dinner: 75, specialDinner: 85, packing: 10 };

// Meal serving windows — single source of truth for "now serving" / "up next" detection.
// Edit these if Hall 14's actual timings differ.
const MEAL_WINDOWS = {
  breakfast: { start: 7, end: 10.5 },
  lunch: { start: 12, end: 15 },
  dinner: { start: 19, end: 21.5 }
};

const DAILY = {
  breakfast: {
    items: ["200ml Milk / 2 Boiled Eggs / 2 Bananas", "Tea", "Sprouts", "Bread", "Jam / Peanut Butter / Amul Butter", "Bournvita / Cornflakes / Coffee", "Dalia"],
    note: "Regular breakfast as per the day's menu, or Bread + Butter + Jam. Butter/jam options: 1 slice butter + 1 spoon jam, or 2 slices butter, or 2 spoons jam, or 2 spoons peanut butter."
  },
  lunch: {
    items: ["Roti (Plain & Butter)", "Curd / Fruits", "Plain Rice", "Sambhar", "Salad", "Pickles"],
    satwik: "Dal, Khichdi, Sabji (Friday: Moong Dal)"
  },
  dinner: {
    items: ["Chapati", "Rice", "Salad", "Pickles", "Rasam"],
    satwik: "Dal, Khichdi, Sabji"
  }
};

// veg = green, nonveg = red — used for the little dot before each item
const NONVEG_HINTS = ["chicken", "fish", "mutton", "egg", "keema", "kalimirch", "tandoori chicken", "korma"];

const MENU = [
  {
    day: "Monday",
    breakfast: { items: ["Veg Sandwich / Pav Bhaji"] },
    lunch: { items: ["Mix Veg", "Arhar Dal", "Jaljeera"], extra: ["Fish Curry", "Aloo Chat", "Ghujiya"] },
    dinner: { items: ["Kaddu", "Jeera Rice", "Chana Dal Tadka"], extra: ["Tandoori Chicken", "Coconut Dry Gulab Jamun", "Paneer Dosa"] }
  },
  {
    day: "Tuesday",
    breakfast: { items: ["Fry Idli", "Idli", "Vada", "Sambhar", "Nariyal Chutney"] },
    lunch: { items: ["Bhindi Do Pyaza", "Masoor Dal"], extra: ["Chilli Chicken / Chicken Fried Rice", "Paneer Tikka Masala", "Doodh Barfi"] },
    dinner: { items: ["Aloo Matar", "Puri (Palak, Plain, Maida)", "White Matar Dal", "Sewai"], extra: ["Honey Chilli Potato", "Paneer Roll", "Chicken Kalimirch"] }
  },
  {
    day: "Wednesday",
    breakfast: { items: ["Paratha (Aloo, Pyaz)", "Green Chutney Sauce"] },
    lunch: { items: ["Kadhi Pakoda", "Aloo Jeera", "Pappad", "Curd / Fruits", "Butter Milk"], extra: ["Chicken Roll", "Milk Peda", "Chilli Mushroom", "Dahi Gujhiya"] },
    dinner: { items: ["Handi Paneer / Matar Paneer, or Butter Chicken / Chicken Korma", "Chana Dal", "Missi Roti", "Tandoori Roti", "Basanti Pulao"], extra: ["Moong Dal Halwa"], special: true }
  },
  {
    day: "Thursday",
    breakfast: { items: ["Besan Chilla / Uthappam", "Sambhar", "Nariyal Chutney"] },
    lunch: { items: ["Amritsari Chola", "Bhatura", "Custard"], extra: ["Fish Curry"] },
    dinner: { items: ["Parwal", "Imli Rice", "French Fries", "Arhar Dal"], extra: ["Chicken Biryani", "Methi Malai Paneer", "Litti Choka", "Kalakand"] }
  },
  {
    day: "Friday",
    breakfast: { items: ["Aloo Sabji", "Poori", "Matar Kachauri", "Halwa", "Chana"] },
    lunch: { items: ["Veg Biryani", "Salan", "Boondi Raita", "Dal Makhani"], extra: ["Egg Curry", "Paneer Jalebi", "Paneer Butter Masala"] },
    dinner: { items: ["Veg Kofta", "Chana Dal Fry", "Chowmin"], extra: ["Mutton Korma", "Bread Malai Sandwich", "Paneer Do Pyaza", "Golgaape"] }
  },
  {
    day: "Saturday",
    breakfast: { items: ["Poha", "Jalebi", "Curd", "Bhujia Namkeen (Mix)"] },
    lunch: { items: ["Paratha (Aloo, Mix-Veg)", "Paneer Paratha (2pc)", "Chola", "Sonth Chutney", "Green Chutney"], extra: ["Fish Finger", "Shahi Toast"] },
    dinner: { items: ["Lauki Jeera / Kathal", "Aloo Bharta", "Kheer"], extra: ["Chicken Biryani", "Milk Cake", "Dahi ke Sholey"] }
  },
  {
    day: "Sunday",
    breakfast: { items: ["Dosa", "Sambhar", "Nariyal Chutney", "Tomato Chutney"] },
    lunch: { items: ["Rajma", "Jeera Rice", "Aloo Baingan"], extra: ["Egg Biryani", "Aloo Posto", "Ras Malai"] },
    dinner: { items: ["Kadhai Paneer / Paneer Butter Masala, or Chicken Kali Mirch", "Arhar Dal", "Pulao", "Butter Naan", "Tandoori Roti", "Gulab Jamun"], special: true }
  }
];
