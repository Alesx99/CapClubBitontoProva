require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { initSchema, createMenuItem, upsertSettings, clearAllMenuItems } = require('./index');

async function seed() {
  console.log('Seeding database with CapClub real menu data...');
  
  // 1. Initialize schema
  await initSchema();
  
  // 2. Clear old mockup items
  try {
    console.log('Clearing old mockup menu items...');
    await clearAllMenuItems();
  } catch (err) {
    console.error('Failed to clear old menu items:', err);
  }
  
  // 3. Set default settings
  const settingsPatch = [
    ['restaurant_name', 'CapClub - Café & Bistrot'],
    ['restaurant_subtitle', 'Café, Sport & Private Club'],
    ['accent_color', '#D4AF37'], // Premium gold
    ['print_frame_color', '#D4AF37'],
    ['font_title', 'Playfair Display'],
    ['font_body', 'Montserrat'],
    ['event_name', 'Festa Esclusiva CapClub'],
    ['event_subtitle', 'Private Night & Gala Dinner'],
    ['section_order', JSON.stringify([
      "Acqua e Soft Drinks",
      "Energy Drinks",
      "Aperitivi e Cocktail",
      "Amari, Liquori e Distillati",
      "Vini e Bollicine",
      "Pizzeria e Cicci",
      "Panini e Wrap",
      "Secondi e Insalate",
      "Servizio"
    ])]
  ];
  await upsertSettings(settingsPatch);
  
  // 4. Define real dishes to seed
  const rawMenu = {
    "Acqua e Soft Drinks": [
      "Acqua Grande",
      "Acqua Piccola",
      "Cedrata",
      "Chino' Sanpellegrino",
      "Coca Cola Lattina",
      "Estathe",
      "Fanta Lattina",
      "Lemon Soda",
      "Sprite Lattina",
      "Succo di Frutta"
    ],
    "Energy Drinks": [
      "Monster",
      "Powerade",
      "Red Bull",
      "Schweppes"
    ],
    "Aperitivi e Cocktail": [
      "Campari Soda",
      "Cocktail Sanp",
      "Crodino",
      "Gin Lemon",
      "Spritz Aperol",
      "Spritz Camp"
    ],
    "Amari, Liquori e Distillati": [
      "Amaro / Limoncello",
      "Chartreuse",
      "Grappa",
      "Jefferson"
    ],
    "Vini e Bollicine": [
      "Calice Vino",
      "Bicchiere Prosecco",
      "Bottiglia Ca' Dei Frati",
      "Bottiglia Catapanus",
      "Bottiglia Costanza",
      "Bottiglia D'Arapri'",
      "Bottiglia Ele'",
      "Bottiglia Falanghina",
      "Bottiglia Farder Prosecc",
      "Bottiglia Prosecco",
      "Bottiglia Spumante Weart",
      "Bottiglia Vino Imperator",
      "Bottiglia Wheart",
      "Favonio"
    ],
    "Pizzeria e Cicci": [
      "4 Formaggi",
      "4 Stagioni",
      "American",
      "Bellavista",
      "Brasciola Di Cavallo",
      "Calabrese",
      "Campana",
      "Capricciosa",
      "Champignon",
      "Ciccio Classico",
      "Ciccio Farcito",
      "Ciccio Pomodorino",
      "Corner",
      "Crudaiola",
      "Crudo",
      "Francesina",
      "Prosciutto E Wurstel",
      "Pugliese",
      "Romana",
      "Scattata Barese",
      "Sprint",
      "Valtellina",
      "Vegetariana",
      "Wurstel"
    ],
    "Panini e Wrap": [
      "American Wrap",
      "Crispy Burger",
      "Panino Cotoletta",
      "Panino Hamburger",
      "Panino Hot Dog"
    ],
    "Secondi e Insalate": [
      "Cotoletta",
      "Filetto Al Pepe Verde",
      "Filetto Alla Griglia",
      "Fitness Salad",
      "Hamburger",
      "Tagliata Di Manzo",
      "Tagliata Di Pollo"
    ],
    "Servizio": [
      "1 Coperto"
    ]
  };

  const dishes = [];
  Object.entries(rawMenu).forEach(([section, items]) => {
    items.forEach((item, index) => {
      dishes.push({
        section,
        title: item,
        description: "",
        price: 0.0,
        available: true,
        position: index,
        is_event: false
      });
    });
  });
  
  // Insert dishes
  for (const dish of dishes) {
    await createMenuItem(dish);
  }

  console.log(`Successfully seeded ${dishes.length} real dishes into the database.`);
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seed;
