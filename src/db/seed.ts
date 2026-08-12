import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { schemaStatements } from "./schema";

type SeedDish = {
  name: string;
  ingredients: string;
  source: string;
  veg: boolean;
  masalas: string;
  category: string;
  description: string;
  image: string;
};

const IMG = {
  bengali:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=70",
  curry:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=70",
  rice: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=70",
  biryani:
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=70",
  noodles:
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=70",
  paneer:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=70",
  sweet:
    "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=70",
  fry: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=70",
  kebab:
    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=70",
  chicken:
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=70",
};

const dishes: SeedDish[] = [
  // ---- Bengali ----
  { name: "Luchi", ingredients: "Refined flour, ghee", source: "Bengali", veg: true, masalas: "Salt", category: "Bread", description: "Deep-fried fluffy Bengali flatbread, a festive favourite.", image: IMG.fry },
  { name: "Aloo Dum", ingredients: "Baby potatoes, tomato, onion", source: "Bengali", veg: true, masalas: "Cumin, turmeric, garam masala", category: "Main Course", description: "Spiced baby potatoes slow-cooked in a rich gravy.", image: IMG.curry },
  { name: "Basanti Pulao", ingredients: "Gobindobhog rice, ghee, cashew, raisin", source: "Bengali", veg: true, masalas: "Bay leaf, cardamom, saffron", category: "Rice", description: "Sweet aromatic Bengali yellow pulao.", image: IMG.rice },
  { name: "Shukto", ingredients: "Mixed vegetables, bitter gourd, milk", source: "Bengali", veg: true, masalas: "Radhuni, mustard, ginger", category: "Bengali", description: "Lightly bitter mixed-vegetable medley served first in a Bengali meal.", image: IMG.bengali },
  { name: "Cholar Dal", ingredients: "Bengal gram, coconut, ghee", source: "Bengali", veg: true, masalas: "Cumin, bay leaf, garam masala", category: "Side Dish", description: "Sweet-savoury lentil dish with coconut, a wedding classic.", image: IMG.curry },
  { name: "Dhokar Dalna", ingredients: "Bengal gram cakes, potato", source: "Bengali", veg: true, masalas: "Cumin, turmeric, ginger", category: "Main Course", description: "Fried lentil cakes simmered in a spiced gravy.", image: IMG.curry },
  { name: "Begun Bhaja", ingredients: "Brinjal, mustard oil", source: "Bengali", veg: true, masalas: "Turmeric, chilli", category: "Starter", description: "Crispy shallow-fried brinjal slices.", image: IMG.fry },
  { name: "Aloo Bhaja", ingredients: "Potato, mustard oil", source: "Bengali", veg: true, masalas: "Turmeric, salt", category: "Side Dish", description: "Thinly sliced crisp-fried potatoes.", image: IMG.fry },
  { name: "Fish Fry", ingredients: "Bhetki fish, breadcrumbs", source: "Bengali", veg: false, masalas: "Pepper, chilli, lemon", category: "Starter", description: "Crumb-coated golden fried fish fillet.", image: IMG.fry },
  { name: "Bhetki Paturi", ingredients: "Bhetki fish, mustard, coconut", source: "Bengali", veg: false, masalas: "Mustard, green chilli, turmeric", category: "Main Course", description: "Fish marinated in mustard paste, wrapped and steamed in banana leaf.", image: IMG.bengali },
  { name: "Kosha Mangsho", ingredients: "Mutton, onion, curd", source: "Bengali", veg: false, masalas: "Garam masala, cumin, ginger-garlic", category: "Main Course", description: "Slow-cooked spicy Bengali mutton in thick gravy.", image: IMG.curry },
  { name: "Chicken Kosha", ingredients: "Chicken, onion, curd", source: "Bengali", veg: false, masalas: "Garam masala, cumin, ginger-garlic", category: "Main Course", description: "Rich slow-cooked spicy chicken.", image: IMG.chicken },
  { name: "Chingri Malai Curry", ingredients: "Prawns, coconut milk", source: "Bengali", veg: false, masalas: "Cardamom, cinnamon, turmeric", category: "Main Course", description: "Prawns in a creamy coconut curry — a Bengali delicacy.", image: IMG.curry },
  { name: "Mishti Doi", ingredients: "Yogurt, jaggery", source: "Bengali", veg: true, masalas: "Cardamom", category: "Dessert", description: "Sweet caramelised set yogurt.", image: IMG.sweet },
  { name: "Rosogolla", ingredients: "Chhena, sugar syrup", source: "Bengali", veg: true, masalas: "Cardamom", category: "Dessert", description: "Soft spongy cottage-cheese balls in light syrup.", image: IMG.sweet },

  // ---- Indo-Chinese ----
  { name: "Veg Hakka Noodles", ingredients: "Noodles, mixed vegetables", source: "Indo-Chinese", veg: true, masalas: "Soy sauce, pepper, garlic", category: "Chinese", description: "Stir-fried noodles with crunchy vegetables.", image: IMG.noodles },
  { name: "Chicken Hakka Noodles", ingredients: "Noodles, chicken, vegetables", source: "Indo-Chinese", veg: false, masalas: "Soy sauce, pepper, garlic", category: "Chinese", description: "Wok-tossed noodles with chicken and vegetables.", image: IMG.noodles },
  { name: "Chicken Manchurian", ingredients: "Chicken, cornflour, onion", source: "Indo-Chinese", veg: false, masalas: "Soy, chilli, garlic, ginger", category: "Chinese", description: "Fried chicken tossed in a tangy Manchurian sauce.", image: IMG.chicken },
  { name: "Chilli Chicken", ingredients: "Chicken, capsicum, onion", source: "Indo-Chinese", veg: false, masalas: "Chilli, soy, garlic", category: "Chinese", description: "Spicy dry chilli chicken with peppers.", image: IMG.chicken },
  { name: "Chilli Paneer", ingredients: "Paneer, capsicum, onion", source: "Indo-Chinese", veg: true, masalas: "Chilli, soy, garlic", category: "Chinese", description: "Cottage cheese cubes in a spicy chilli sauce.", image: IMG.paneer },
  { name: "Fried Rice", ingredients: "Rice, mixed vegetables", source: "Indo-Chinese", veg: true, masalas: "Pepper, soy, garlic", category: "Rice", description: "Classic vegetable fried rice.", image: IMG.rice },
  { name: "Schezwan Chicken", ingredients: "Chicken, schezwan sauce", source: "Indo-Chinese", veg: false, masalas: "Schezwan, chilli, garlic", category: "Chinese", description: "Fiery schezwan-style chicken.", image: IMG.chicken },

  // ---- Mughlai ----
  { name: "Chicken Biryani", ingredients: "Basmati rice, chicken, curd", source: "Mughlai", veg: false, masalas: "Biryani masala, saffron, cardamom", category: "Rice", description: "Fragrant layered chicken biryani.", image: IMG.biryani },
  { name: "Mutton Biryani", ingredients: "Basmati rice, mutton, curd", source: "Mughlai", veg: false, masalas: "Biryani masala, saffron, cardamom", category: "Rice", description: "Royal slow-cooked mutton biryani.", image: IMG.biryani },
  { name: "Chicken Korma", ingredients: "Chicken, cashew, cream", source: "Mughlai", veg: false, masalas: "Garam masala, cardamom, mace", category: "Main Course", description: "Mild creamy Mughlai chicken curry.", image: IMG.curry },
  { name: "Mutton Rogan Josh", ingredients: "Mutton, curd, onion", source: "Mughlai", veg: false, masalas: "Kashmiri chilli, fennel, garam masala", category: "Main Course", description: "Aromatic slow-cooked mutton in red gravy.", image: IMG.curry },
  { name: "Butter Chicken", ingredients: "Chicken, tomato, butter, cream", source: "Mughlai", veg: false, masalas: "Garam masala, kasuri methi", category: "Main Course", description: "Tandoori chicken in a rich buttery tomato gravy.", image: IMG.chicken },
  { name: "Shahi Paneer", ingredients: "Paneer, cashew, cream", source: "Mughlai", veg: true, masalas: "Garam masala, cardamom", category: "Main Course", description: "Cottage cheese in a royal creamy gravy.", image: IMG.paneer },
  { name: "Chicken Tikka", ingredients: "Chicken, curd", source: "Mughlai", veg: false, masalas: "Tandoori masala, chilli", category: "Starter", description: "Char-grilled marinated chicken chunks.", image: IMG.kebab },
  { name: "Seekh Kebab", ingredients: "Minced meat, onion", source: "Mughlai", veg: false, masalas: "Garam masala, chilli, ginger-garlic", category: "Starter", description: "Spiced minced-meat skewers grilled to perfection.", image: IMG.kebab },
];

type SeedMenu = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dishes: string[];
};

const menus: SeedMenu[] = [
  {
    name: "Bengali Classic",
    description: "Traditional Bengali dishes suitable for family functions and celebrations.",
    price: 499,
    category: "Bengali",
    image: IMG.bengali,
    dishes: ["Luchi", "Aloo Dum", "Basanti Pulao", "Cholar Dal", "Begun Bhaja", "Mishti Doi", "Rosogolla"],
  },
  {
    name: "Bengali Grand Feast",
    description: "A premium Bengali menu for weddings and large celebrations.",
    price: 899,
    category: "Bengali",
    image: IMG.curry,
    dishes: ["Luchi", "Basanti Pulao", "Shukto", "Cholar Dal", "Bhetki Paturi", "Kosha Mangsho", "Chingri Malai Curry", "Mishti Doi", "Rosogolla"],
  },
  {
    name: "Indo-Chinese Delight",
    description: "Popular Indo-Chinese starters, main courses and accompaniments.",
    price: 549,
    category: "Indo-Chinese",
    image: IMG.noodles,
    dishes: ["Veg Hakka Noodles", "Chicken Hakka Noodles", "Chicken Manchurian", "Chilli Paneer", "Fried Rice", "Schezwan Chicken"],
  },
  {
    name: "Mughlai Royal",
    description: "Rich Mughlai dishes suitable for premium events.",
    price: 999,
    category: "Mughlai",
    image: IMG.biryani,
    dishes: ["Chicken Biryani", "Mutton Rogan Josh", "Butter Chicken", "Shahi Paneer", "Chicken Tikka", "Seekh Kebab"],
  },
  {
    name: "Celebration Special",
    description: "A balanced combination of Bengali, Indo-Chinese and Mughlai dishes.",
    price: 1199,
    category: "Mixed",
    image: IMG.chicken,
    dishes: ["Basanti Pulao", "Kosha Mangsho", "Chilli Chicken", "Chicken Biryani", "Shahi Paneer", "Fish Fry", "Rosogolla", "Mishti Doi"],
  },
];

const testimonials = [
  { name: "Anindita Sen", email: "anindita@example.com", rating: 5, feedback: "Excellent Bengali food and wonderful service. Everyone loved the food at my daughter's wedding!" },
  { name: "Rahul Das", email: "rahul@example.com", rating: 5, feedback: "The Mughlai Royal menu was a hit at our corporate event. Professional and punctual team." },
  { name: "Priya Sharma", email: "priya@example.com", rating: 4, feedback: "Loved the Indo-Chinese spread for my birthday. Tasty and beautifully presented." },
  { name: "Sourav Ghosh", email: "sourav@example.com", rating: 5, feedback: "Kosha Mangsho and Basanti Pulao were authentic and delicious. Highly recommend Aaharika." },
];

async function seed() {
  console.log("Ensuring schema exists...");
  for (const statement of schemaStatements) {
    await db.execute(statement);
  }

  // ---- Admin (idempotent) ----
  const adminEmail = "admin@aaharika.com";
  const existingAdmin = await db.execute({
    sql: "SELECT AdminID FROM Admin WHERE Email = ?",
    args: [adminEmail],
  });
  if (existingAdmin.rows.length === 0) {
    const passwordHash = await bcrypt.hash("Admin@123", 12);
    await db.execute({
      sql: "INSERT INTO Admin (Name, Email, ContactNumber, PasswordHash) VALUES (?, ?, ?, ?)",
      args: ["Aaharika Admin", adminEmail, "+919000000000", passwordHash],
    });
    console.log(`✔ Default admin created: ${adminEmail} / Admin@123`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  // ---- Dishes ----
  const dishIdByName = new Map<string, number>();
  const existingDishes = await db.execute("SELECT COUNT(*) AS c FROM Dish");
  const dishCount = Number(existingDishes.rows[0].c);
  if (dishCount === 0) {
    let i = 1;
    for (const d of dishes) {
      const code = `DISH-${String(i).padStart(4, "0")}`;
      const res = await db.execute({
        sql: `INSERT INTO Dish (DishCode, DishName, MainIngredients, SourceOfDish, IsVegetarian, MasalasUsed, ImageURL, Category, Description, IsActive)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [code, d.name, d.ingredients, d.source, d.veg ? 1 : 0, d.masalas, d.image, d.category, d.description],
      });
      dishIdByName.set(d.name, Number(res.lastInsertRowid));
      i++;
    }
    console.log(`✔ Inserted ${dishes.length} dishes.`);
  } else {
    const rows = await db.execute("SELECT DishID, DishName FROM Dish");
    for (const r of rows.rows) dishIdByName.set(String(r.DishName), Number(r.DishID));
    console.log("Dishes already exist, skipping insert.");
  }

  // ---- Menus + MenuDish ----
  const existingMenus = await db.execute("SELECT COUNT(*) AS c FROM Menu");
  if (Number(existingMenus.rows[0].c) === 0) {
    for (const m of menus) {
      const res = await db.execute({
        sql: `INSERT INTO Menu (MenuName, Description, Price, PriceUnit, ImageURL, Category, IsActive)
              VALUES (?, ?, ?, 'Per Guest', ?, ?, 1)`,
        args: [m.name, m.description, m.price, m.image, m.category],
      });
      const menuId = Number(res.lastInsertRowid);
      let order = 1;
      for (const dishName of m.dishes) {
        const dishId = dishIdByName.get(dishName);
        if (dishId) {
          await db.execute({
            sql: "INSERT INTO MenuDish (MenuID, DishID, DisplayOrder) VALUES (?, ?, ?)",
            args: [menuId, dishId, order++],
          });
        }
      }
    }
    console.log(`✔ Inserted ${menus.length} menus with dish links.`);
  } else {
    console.log("Menus already exist, skipping insert.");
  }

  // ---- Testimonials (approved) ----
  const existingT = await db.execute("SELECT COUNT(*) AS c FROM Testimonials");
  if (Number(existingT.rows[0].c) === 0) {
    for (const t of testimonials) {
      await db.execute({
        sql: "INSERT INTO Testimonials (Name, Email, Rating, Feedback, Status) VALUES (?, ?, ?, ?, 'Approved')",
        args: [t.name, t.email, t.rating, t.feedback],
      });
    }
    console.log(`✔ Inserted ${testimonials.length} approved testimonials.`);
  } else {
    console.log("Testimonials already exist, skipping insert.");
  }

  console.log("Seeding complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
