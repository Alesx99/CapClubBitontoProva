const { initSchema, createMenuItem, getAllSettings, upsertSettings } = require('./index');

async function seed() {
  console.log('Seeding database with CapClub default data...');
  
  // 1. Initialize schema
  await initSchema();
  
  // 2. Set default settings
  const settingsPatch = [
    ['restaurant_name', 'CapClub - Café & Bistrot'],
    ['restaurant_subtitle', 'Café, Sport & Private Club'],
    ['accent_color', '#D4AF37'], // Premium gold
    ['print_frame_color', '#D4AF37'],
    ['font_title', 'Playfair Display'],
    ['font_body', 'Montserrat'],
    ['event_name', 'Gran Galà di Capodanno'],
    ['event_subtitle', 'Exclusive Golden Night'],
  ];
  await upsertSettings(settingsPatch);
  
  // 3. Define dishes to seed
  const dishes = [
    // === COCKTAIL D'AUTORE ===
    {
      section: "Cocktail d'Autore",
      title: "Royal Champagne Mojito",
      description: "Rum invecchiato 7 anni, foglie di menta fresca del nostro orto botanico, zucchero di canna grezzo, succo di lime fresco, rabboccato con Champagne Brut Royal.",
      price: 16.0,
      available: true,
      position: 0,
      is_event: false
    },
    {
      section: "Cocktail d'Autore",
      title: "Smoked Negroni Clad",
      description: "Gin Premium infuso alle botaniche mediterranee, Vermouth rosso barricato in botti di rovere, Bitter Campari affumicato al legno di melo selvatico.",
      price: 15.0,
      available: true,
      position: 1,
      is_event: false
    },
    {
      section: "Cocktail d'Autore",
      title: "Golden Martini",
      description: "Vodka d'élite infusa alle zeste di limone sfusato amalfitano, Dry Vermouth riserva, guarnito con una preziosa spirale di limone e scaglie d'oro edibili 24K.",
      price: 18.0,
      available: true,
      position: 2,
      is_event: false
    },

    // === CRUDI DI MARE ===
    {
      section: "Crudi di Mare",
      title: "Gran Plateau Royal",
      description: "Selezione imperiale per due persone: 4 Ostriche Gillardeau N.3, 4 scampi locali di nassa, 4 gamberi rossi di Mazara del Vallo, tartare di tonno rosso pinna blu con maionese al wasabi e sashimi di ricciola.",
      price: 45.0,
      available: true,
      position: 0,
      is_event: false
    },
    {
      section: "Crudi di Mare",
      title: "Tartare di Salmone Selvaggio",
      description: "Salmone rosso d'Alaska battuto al coltello, servito con dadolata di avocado biologico, mela verde Granny Smith acidula, gelatina al bergamotto e cialde di riso al nero di seppia.",
      price: 22.0,
      available: true,
      position: 1,
      is_event: false
    },
    {
      section: "Crudi di Mare",
      title: "Carpaccio di Gambero Rosso",
      description: "Gamberi rossi freschissimi di Mazara battuti finemente, conditi con zeste di lime, fili di peperoncino dolce, perle di olio extravergine d'oliva e sale nero di Cipro.",
      price: 26.0,
      available: true,
      position: 2,
      is_event: false
    },

    // === SELEZIONI PREMIUM CARNE ===
    {
      section: "Selezioni Premium Carni",
      title: "Filetto al Tartufo Nero",
      description: "Filetto di manzo di razza Piemontese scottato alle erbe, scaloppa di foie gras d'anatra, riduzione vellutata al Porto Tawny e lamelle di tartufo nero pregiato di Norcia.",
      price: 38.0,
      available: true,
      position: 0,
      is_event: false
    },
    {
      section: "Selezioni Premium Carni",
      title: "Ribeye di Wagyu Giapponese A5",
      description: "Pregiato taglio di Wagyu di Kagoshima grado A5 (150g) cotto direttamente su pietra lavica bollente al tavolo, servito con fiocchi di sale Maldon affumicato e salsa teriyaki artigianale.",
      price: 85.0,
      available: true,
      position: 1,
      is_event: false
    },
    {
      section: "Selezioni Premium Carni",
      title: "Costolette d'Agnello in Crosta di Pistacchio",
      description: "Costolette d'agnello da pascolo cotte rosa, rivestite con una delicata crosta di pistacchi di Bronte tostati ed erbe aromatiche montane, accompagnate da purè di patate dolci.",
      price: 32.0,
      available: true,
      position: 2,
      is_event: false
    },

    // === PRIMI PIATTI ===
    {
      section: "Primi Piatti",
      title: "Spaghetto ai Ricci e Caviale Oscietra",
      description: "Spaghetti Cavalieri trafilati al bronzo mantecati con polpa di ricci freschi del Mediterraneo, burro acido normanno e guarniti con un cucchiaio di prestigioso Caviale Oscietra.",
      price: 28.0,
      available: true,
      position: 0,
      is_event: false
    },
    {
      section: "Primi Piatti",
      title: "Risotto Champagne & Zafferano",
      description: "Risotto Riserva San Massimo mantecato allo zafferano puro dell'Aquila DOP, sfumato allo Champagne Dom Pérignon e decorato al centro con foglia d'oro edibile.",
      price: 25.0,
      available: true,
      position: 1,
      is_event: false
    },

    // === DOLCI ===
    {
      section: "I Dolci",
      title: "Mousse Champagne & Lamponi",
      description: "Mousse leggera al cioccolato bianco Ivoire e Champagne, con cuore fluido al lampone selvatico su base croccante di biscotto sabbiato.",
      price: 12.0,
      available: true,
      position: 0,
      is_event: false
    },
    {
      section: "I Dolci",
      title: "Sacher CapClub Rivisitata",
      description: "Biscotto sacher bagnato all'albicocca, mousse al cioccolato fondente Valrhona Guanaja 70%, composta calda di albicocche del Vesuvio e quenelle di gelato artigianale al fior di sale.",
      price: 12.0,
      available: true,
      position: 1,
      is_event: false
    },

    // === EVENT MENU PIATTI ===
    {
      section: "Menu di Gala",
      title: "Ostrica Imperiale al Caviale",
      description: "Ostrica del Belon servita ghiacciata con emulsione allo Champagne e perle di caviale beluga.",
      price: 18.0,
      available: true,
      position: 0,
      is_event: true
    },
    {
      section: "Menu di Gala",
      title: "Tagliolino all'Astice Blu",
      description: "Tagliolini all'uovo fatti in casa saltati con astice blu della Bretagna, datterini canditi e sfumati al Cognac Fine Champagne.",
      price: 35.0,
      available: true,
      position: 1,
      is_event: true
    },
    {
      section: "Menu di Gala",
      title: "Sfera d'Oro al Cioccolato Bianco",
      description: "Guscio di cioccolato bianco rivestito d'oro 24k con all'interno gelato al pistacchio salato, servito con salsa calda di frutti rossi versata al tavolo.",
      price: 15.0,
      available: true,
      position: 2,
      is_event: true
    }
  ];

  // Insert dishes
  for (const dish of dishes) {
    await createMenuItem(dish);
  }

  console.log(`Successfully seeded ${dishes.length} dishes into the database.`);
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
