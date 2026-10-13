// Hall-14 IIT Kanpur Mess Menu — October 2026
// Structured from the official mess menu sheet (Mess_Menu_Oct-2026_Hall14_Updated.pdf).

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
    items: ["200ml Milk / 2 Boiled Eggs / Seasonal Fruits", "Tea", "Sprouts", "Boiled Sprouts", "Brown Bread", "Jam / Peanut Butter / Amul Butter Tikki", "Bournvita / Cornflakes / Coffee", "Dalia"],
    note: "Regular breakfast as per the day's menu, or Brown Bread + Butter + Jam. Butter/jam options: 1 slice butter + 1 spoon jam, or 2 slices butter, or 2 spoons jam, or 2 spoons peanut butter."
  },
  lunch: {
    items: ["Roti (Plain & Butter)", "Plain Rice", "Sambhar", "Salad", "Pickles"],
    satwik: "Dal, Khichdi, Sabji (Friday: Moong Dal)"
  },
  dinner: {
    items: ["Chapati", "Rice", "Salad", "Pickles", "Rasam"],
    satwik: "Dal, Khichdi, Sabji"
  }
};

// veg = green, nonveg = red — used for the little dot before each item
const NONVEG_HINTS = ["chicken", "fish", "mutton", "egg", "keema", "kalimirch", "kali mirch", "tandoori chicken", "korma", "nuggets", "rogan josh", "kosha"];

const MENU = [
  {
    day: "Monday",
    breakfast: { items: ["Masala Idli", "Fry Idli", "Idli", "Vada", "Sambhar", "Coconut Chutney"] },
    lunch: { items: ["Mix Veg (Aloo, Matar, Shimla Mirch, Gobi/Patta Gobi, Tomato)", "Mashoor Dal", "Curd / Fruits / Lassi"], extra: ["Lite Fish Curry with Aloo", "Aloo Chat", "Balu Sahi", "Ghujiya"] },
    dinner: { items: ["Soyabean Aloo", "Jeera Rice", "Chana Dal Tadka"], extra: ["Chicken Nuggets", "Paneer Dosa", "Coconut Dry Gulab Jamun", "Dal Baati"] }
  },
  {
    day: "Tuesday",
    breakfast: { items: ["Vada Pav / Pav Bhaji"] },
    lunch: { items: ["Fried Crunchy Aloo Bhindi / Bhindi Do Pyaza", "Moong Dal", "Curd / Fruits / Butter Milk"], extra: ["Chilli Chicken / Chicken Fried Rice", "Chilli Paneer", "Doodh Barfi"] },
    dinner: { items: ["Aloo Matar", "Puri (Palak, Plain, Maida)", "White Matar Dal", "Sewai / Kheer"], extra: ["Tandoori Chicken", "Honey Chilli Potato", "Litti Choka"] }
  },
  {
    day: "Wednesday",
    breakfast: { items: ["Paratha (Aloo, Sattu/Mooli, Pyaz)", "Green Chutney Sauce", "Sauce", "Milk / Curd / Eggs"] },
    lunch: { items: ["Soyabean Chaap", "Kali Mashoor", "Tehri", "Pappad", "Curd / Fruits"], extra: ["Chicken Kosha / Chicken Roll", "Milk Peda", "Chilli Mushroom"] },
    dinner: { items: ["Matar Paneer / Paneer Butter Masala / Handi Paneer, or Butter Chicken / Chicken Malai Tikka", "Chana Nariyal Dal", "Plain Paratha"], extra: ["Moong Dal Halwa"], special: true }
  },
  {
    day: "Thursday",
    breakfast: { items: ["Veg Macaroni / Pasta (Sujiwala) / Cutlet", "Halwa Chana"] },
    lunch: { items: ["Veg Hyderabadi Biriyani / Pulao", "Salan", "Boondi Raita", "Dal Makhni"], extra: ["Egg Curry", "Paneer Tikka", "Shahi Toast / Coconut Barfi"] },
    dinner: { items: ["Veg Kofta / Patta Gobhi Gajar Matar", "Chana Dal", "French Fries / Fryums", "Papad"], extra: ["Mutton Korma", "Cheese Fries", "Kalakand", "Paneer Do Pyaza"] }
  },
  {
    day: "Friday",
    breakfast: { items: ["Besan Chilla / Uthappam", "Sambhar", "Nariyal Chutney"] },
    lunch: { items: ["Amritsari Chole", "Bhature", "Custard / Ice Cream"], extra: ["Mustard Fish Curry", "Spring Roll", "Malai Boondi"] },
    dinner: { items: ["Chilli Soyabean Pulao", "Kala Chana Curry", "Arhar Dal"], extra: ["Chicken Kali Mirch / Achari Chicken", "Mushroom Paneer Gravy"] }
  },
  {
    day: "Saturday",
    breakfast: { items: ["Poha", "Jalebi", "Curd", "Bhujia Namkeen (Mix)"] },
    lunch: { items: ["Paratha (Aloo, Mix-Veg)", "Paneer Paratha", "Chola", "Sonth Chutney", "Green Chutney", "Curd / Fruits"], extra: ["Fish Finger", "Dahi Kabab"] },
    dinner: { items: ["Rajma", "Jeera Rice", "Aloo Baigan / Lauki Chana / Baigan Ka Bharta", "Roti", "Salad", "Papad"], extra: ["Hyderabadi Chicken Biriyani", "Paneer Pakoda / Chilli Mushroom", "Milk Cake"] }
  },
  {
    day: "Sunday",
    breakfast: { items: ["Dosa", "Sambhar", "Nariyal Chutney", "Tomato Chutney"] },
    lunch: { items: ["Rajma", "Sev Tamatar Sbzi", "Fruits"], extra: ["Egg Biriyani", "Boondi Laddu / Ras Malai", "Tomato Kaju Paneer"] },
    dinner: { items: ["Kadhai Paneer / Matar Paneer, or Chicken Rogan Josh", "Arhar Dal", "Pulao", "Butter Naan", "Tandoori Roti", "Gulab Jamun / White Rosogolla"], special: true }
  }
];
