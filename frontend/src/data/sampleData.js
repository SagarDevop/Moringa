// Sample product and category data using Stitch project image URLs
// These serve as the initial catalog; admin can modify via the admin panel

export const CATEGORIES = [
  { id: 'grocery_kirana', name: 'Grocery & Kirana', icon: 'storefront', bgColor: 'rgba(0, 106, 106, 0.1)', color: '#006A6A', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60' },
  { id: 'fruits_veg', name: 'Fruits & Vegetables', icon: 'eco', bgColor: 'rgba(45, 138, 78, 0.1)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60' },
  { id: 'dairy_bakery', name: 'Dairy & Bakery', icon: 'bakery_dining', bgColor: 'rgba(150, 75, 0, 0.1)', color: '#964b00', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60' },
  { id: 'beverages', name: 'Beverages', icon: 'local_cafe', bgColor: 'rgba(51, 153, 255, 0.1)', color: '#3399ff', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' },
  { id: 'snacks_namkeen', name: 'Snacks & Namkeen', icon: 'cookie', bgColor: 'rgba(255, 102, 0, 0.1)', color: '#ff6600', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60' },
  { id: 'home_kitchen', name: 'Home & Kitchen', icon: 'kitchen', bgColor: 'rgba(103, 80, 164, 0.1)', color: '#6750A4', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60' },
  { id: 'cleaning_household', name: 'Cleaning & Household', icon: 'cleaning_services', bgColor: 'rgba(0, 150, 136, 0.1)', color: '#009688', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60' },
  { id: 'baby_care', name: 'Baby Care', icon: 'child_care', bgColor: 'rgba(255, 217, 228, 0.3)', color: '#ff4081', image: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=500&auto=format&fit=crop&q=60' },
  { id: 'stationery', name: 'Stationery', icon: 'edit', bgColor: 'rgba(188, 240, 174, 0.2)', color: '#2d8a4e', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60' },
  { id: 'electronics_accessories', name: 'Electronics & Accessories', icon: 'devices', bgColor: 'rgba(103, 80, 164, 0.15)', color: '#6750A4', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60' },
  { id: 'fashion_clothing', name: 'Fashion & Clothing', icon: 'checkroom', bgColor: 'rgba(255, 218, 214, 0.3)', color: '#ba1a1a', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60' },
  { id: 'footwear', name: 'Footwear', icon: 'directions_walk', bgColor: 'rgba(255, 222, 168, 0.3)', color: '#7c5800', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
  { id: 'others', name: 'Others', icon: 'category', bgColor: 'rgba(128, 128, 128, 0.1)', color: '#808080', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60' },
  { id: 'flowers_garlands', name: 'Flowers & Garlands', icon: 'local_florist', bgColor: 'rgba(204, 51, 51, 0.1)', color: '#cc3333', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&auto=format&fit=crop&q=60' }
];

export const PRODUCTS = [
  // Fruits
  { id: 'p1', name: 'Alphonso Mango', category: 'fruits', price: 150, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60', description: 'Sweet and premium Alphonso mangoes from local growers.' },
  { id: 'p2', name: 'Cavendish Banana', category: 'fruits', price: 60, unit: 'dozen', available: true, featured: false, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60', description: 'Fresh, yellow ripe Cavendish bananas.' },
  { id: 'p3', name: 'Fresh Apple', category: 'fruits', price: 180, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60', description: 'Crisp, sweet red apples imported fresh.' },
  { id: 'p4', name: 'Pomegranate (Anar)', category: 'fruits', price: 160, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=500&auto=format&fit=crop&q=60', description: 'Juicy, ruby-red pomegranate seeds packed with nutrients.' },
  { id: 'p5', name: 'Green Grapes', category: 'fruits', price: 90, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=60', description: 'Sweet, seedless fresh green grapes.' },
  { id: 'p6', name: 'Sweet Orange (Santra)', category: 'fruits', price: 80, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=60', description: 'Tangy and sweet Nagpur oranges.' },
  { id: 'p37', name: 'Fresh Papaya (Papita)', category: 'fruits', price: 60, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&auto=format&fit=crop&q=60', description: 'Sweet, orange-fleshed local papaya, rich in Vitamin A.' },
  { id: 'p38', name: 'Fresh Pineapple (Ananas)', category: 'fruits', price: 80, unit: 'piece', available: true, featured: false, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=60', description: 'Tangy and sweet tropical pineapple.' },
  { id: 'p39', name: 'Watermelon (Tarbooj)', category: 'fruits', price: 40, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60', description: 'Refreshing, sweet and juicy red watermelon.' },

  // Vegetables
  { id: 'p7', name: 'Fresh Spinach', category: 'vegetables', price: 40, unit: 'bunch', available: true, featured: true, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60', description: 'Freshly harvested green organic spinach leaves.' },
  { id: 'p8', name: 'Broccoli', category: 'vegetables', price: 90, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=60', description: 'Nutrient-rich, fresh green broccoli florets.' },
  { id: 'p9', name: 'Desi Tomatoes', category: 'vegetables', price: 30, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=60', description: 'Tangy, red farm-fresh local tomatoes.' },
  { id: 'p10', name: 'Fresh Potatoes', category: 'vegetables', price: 25, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60', description: 'Premium quality organic potatoes direct from farms.' },
  { id: 'p11', name: 'Red Onions', category: 'vegetables', price: 40, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1508747703725-719ae2c13d4b?w=500&auto=format&fit=crop&q=60', description: 'Crisp and flavorful red onions.' },
  { id: 'p12', name: 'Green Chilies', category: 'vegetables', price: 20, unit: '250g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1588252303782-cb80119cb665?w=500&auto=format&fit=crop&q=60', description: 'Fresh, spicy local green chilies.' },
  { id: 'p13', name: 'Fresh Cauliflower', category: 'vegetables', price: 40, unit: 'piece', available: true, featured: true, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?w=500&auto=format&fit=crop&q=60', description: 'Fresh, compact white cauliflower heads.' },
  { id: 'p40', name: 'Fresh Carrots', category: 'vegetables', price: 50, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60', description: 'Crunchy, sweet orange carrots.' },
  { id: 'p41', name: 'Green Peas (Matar)', category: 'vegetables', price: 60, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1587593817642-80ac148a8943?w=500&auto=format&fit=crop&q=60', description: 'Sweet green peas, fresh from the pod.' },
  { id: 'p42', name: 'Fresh Garlic (Lahsun)', category: 'vegetables', price: 30, unit: '250g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=60', description: 'Pungent and fresh local garlic bulbs.' },
  { id: 'p43', name: 'Fresh Ginger (Adrak)', category: 'vegetables', price: 40, unit: '250g', available: true, featured: true, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=60', description: 'Spicy, aromatic ginger root.' },

  // Dry Fruits
  { id: 'p14', name: 'Premium Almonds', category: 'dryfruits', price: 850, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=500&auto=format&fit=crop&q=60', description: 'High quality Californian almonds, rich in taste.' },
  { id: 'p15', name: 'Shelled Walnuts', category: 'dryfruits', price: 950, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=80', description: 'Premium halves of fresh, brain-boosting walnuts.' },
  { id: 'p16', name: 'Cashews (Kaju)', category: 'dryfruits', price: 800, unit: 'kg', available: true, featured: true, image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=500&auto=format&fit=crop&q=60', description: 'Large, sweet, and crunchy premium cashew nuts.' },
  { id: 'p17', name: 'Seedless Raisins', category: 'dryfruits', price: 300, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=500&auto=format&fit=crop&q=60', description: 'Sweet, natural seedless green raisins.' },
  { id: 'p18', name: 'Premium Dates', category: 'dryfruits', price: 250, unit: '500g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=500&auto=format&fit=crop&q=60', description: 'Rich, soft, and naturally sweet premium dates.' },
  { id: 'p44', name: 'Salted Pistachios (Pista)', category: 'dryfruits', price: 480, unit: '500g', available: true, featured: true, image: 'https://images.unsplash.com/photo-1606060100602-c3f60fefc5a1?w=500&auto=format&fit=crop&q=60', description: 'Delicious, salted, and roasted premium pistachios.' },
  { id: 'p45', name: 'Dried Figs (Anjeer)', category: 'dryfruits', price: 350, unit: '500g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=60', description: 'Soft and sweet premium dried figs.' },

  // Flowers
  { id: 'p19', name: 'Red Roses', category: 'flowers', price: 120, unit: 'bouquet', available: true, featured: true, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60', description: 'Beautiful fresh red roses bouquet for decoration or gifts.' },
  { id: 'p20', name: 'Yellow Marigold', category: 'flowers', price: 80, unit: 'kg', available: true, featured: false, image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=500&auto=format&fit=crop&q=60', description: 'Fresh yellow marigold (genda phool) for pooja decorations.' },
  { id: 'p21', name: 'White Jasmine', category: 'flowers', price: 100, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1508784932256-4757e246313b?w=500&auto=format&fit=crop&q=60', description: 'Fragrant white jasmine flowers for worship.' },
  { id: 'p22', name: 'Pooja Garland (Mala)', category: 'flowers', price: 30, unit: 'piece', available: true, featured: true, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=60', description: 'Freshly woven marigold and rose garland.' },
  { id: 'p46', name: 'Lotus Flower (Kamal)', category: 'flowers', price: 40, unit: 'piece', available: true, featured: true, image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=60', description: 'Sacred fresh pink lotus flower for pooja rituals.' },
  { id: 'p47', name: 'Hibiscus (Gudhal)', category: 'flowers', price: 20, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=500&auto=format&fit=crop&q=60', description: 'Fresh red hibiscus flowers, ideal for daily worship.' },
  { id: 'p48', name: 'Pooja Patra Mix', category: 'flowers', price: 15, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=500&auto=format&fit=crop&q=60', description: 'Freshly plucked Bel leaves and sacred Holy Basil (Tulsi) leaves.' },

  // Dairy
  { id: 'p23', name: 'Pure Cow Ghee', category: 'dairy', price: 750, unit: 'litre', available: true, featured: true, image: 'https://images.unsplash.com/photo-1628113315820-f4834f66e56d?w=500&auto=format&fit=crop&q=60', description: 'Pure, aromatic cow ghee prepared traditionally.' },
  { id: 'p24', name: 'Fresh Paneer', category: 'dairy', price: 120, unit: '400g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=60', description: 'Soft, fresh, and creamy cottage cheese.' },
  { id: 'p25', name: 'Fresh Cow Milk', category: 'dairy', price: 60, unit: 'litre', available: true, featured: false, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60', description: 'Pure, pasteurized fresh cow milk.' },
  { id: 'p26', name: 'Thick Curd (Dahi)', category: 'dairy', price: 50, unit: '500g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60', description: 'Creamy, thick, naturally set curd.' },
  { id: 'p49', name: 'Premium Salted Butter', category: 'dairy', price: 105, unit: '500g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60', description: 'Rich and creamy salted table butter.' },
  { id: 'p50', name: 'Fresh Cream (Malai)', category: 'dairy', price: 70, unit: '250g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', description: 'Thick, fresh dairy cream for cooking or desserts.' },
  { id: 'p51', name: 'Cow Milk Peda', category: 'dairy', price: 180, unit: '250g', available: true, featured: true, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60', description: 'Traditional sweet made from condensed cow milk.' },

  // Spices
  { id: 'p27', name: 'Coriander Powder', category: 'spices', price: 50, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=60', description: 'Aromatic coriander powder processed from local spices.' },
  { id: 'p28', name: 'Organic Turmeric', category: 'spices', price: 60, unit: 'pack', available: true, featured: true, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60', description: 'Pure organic turmeric powder with high curcumin content.' },
  { id: 'p29', name: 'Red Chili Powder', category: 'spices', price: 70, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=60', description: 'Spicy ground red chili powder.' },
  { id: 'p30', name: 'Garam Masala', category: 'spices', price: 80, unit: 'pack', available: true, featured: true, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60', description: 'Authentic Indian blended spice powder.' },
  { id: 'p52', name: 'Black Pepper', category: 'spices', price: 80, unit: '100g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1532138245592-ffbe8cb04f0d?w=500&auto=format&fit=crop&q=60', description: 'Premium whole black pepper corns.' },
  { id: 'p53', name: 'Whole Cumin (Jeera)', category: 'spices', price: 65, unit: '200g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60', description: 'Aromatic, highly-flavored whole cumin seeds.' },
  { id: 'p54', name: 'Green Cardamom (Elaichi)', category: 'spices', price: 150, unit: '50g', available: true, featured: false, image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=500&auto=format&fit=crop&q=60', description: 'Fragrant green cardamom pods for sweets and tea.' },

  // Bakery
  { id: 'p31', name: 'Whole Wheat Bread', category: 'bakery', price: 45, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60', description: 'Fresh, soft whole wheat bread sliced.' },
  { id: 'p32', name: 'Suji Rusk', category: 'bakery', price: 60, unit: 'pack', available: true, featured: true, image: 'https://images.unsplash.com/photo-1600431521340-491eca880813?w=500&auto=format&fit=crop&q=60', description: 'Crispy, crunchy semolina (suji) rusk.' },
  { id: 'p33', name: 'Local Potato Chips', category: 'bakery', price: 30, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60', description: 'Salted potato chips prepared locally.' },
  { id: 'p55', name: 'Chocolate Cookies', category: 'bakery', price: 80, unit: 'pack', available: true, featured: true, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=60', description: 'Crunchy cookies loaded with rich chocolate chips.' },
  { id: 'p56', name: 'Butter Cookies', category: 'bakery', price: 90, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1558961312-50a49c9527a5?w=500&auto=format&fit=crop&q=60', description: 'Melt-in-mouth premium butter cookies.' },
  { id: 'p57', name: 'Multi-grain Crackers', category: 'bakery', price: 60, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&auto=format&fit=crop&q=60', description: 'Healthy multi-grain baked crackers.' },

  // Beverages
  { id: 'p34', name: 'Fresh Sugarcane Juice', category: 'beverages', price: 30, unit: 'bottle', available: true, featured: true, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60', description: 'Freshly pressed sugarcane juice with ginger & lemon.' },
  { id: 'p35', name: 'Natural Coconut Water', category: 'beverages', price: 50, unit: 'piece', available: true, featured: false, image: 'https://images.unsplash.com/photo-1525385133336-254847240f92?w=500&auto=format&fit=crop&q=60', description: 'Hydrating, sweet tender coconut water.' },
  { id: 'p36', name: 'Masala Lemonade', category: 'beverages', price: 40, unit: 'bottle', available: true, featured: false, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', description: 'Chilled local style lemonade with special spices.' },
  { id: 'p58', name: 'Sweet Mango Lassi', category: 'beverages', price: 40, unit: 'bottle', available: true, featured: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60', description: 'Creamy yogurt beverage flavored with Alphonso mango.' },
  { id: 'p59', name: 'Masala Chai Premix', category: 'beverages', price: 120, unit: 'pack', available: true, featured: false, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', description: 'Instant tea premix with ginger, cardamom, and spices.' },
  { id: 'p60', name: 'Chilled Badam Milk', category: 'beverages', price: 50, unit: 'bottle', available: true, featured: false, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', description: 'Chilled milk infused with almonds, saffron, and cardamoms.' }
];

// WhatsApp business number
export const WHATSAPP_NUMBER = '917016371119';

// App configuration
export const APP_CONFIG = {
  name: 'Botanís',
  tagline: 'Your Trusted Path to Healthy Living',
  currency: '₹',
  deliveryFee: 20,
  deliveryText: '₹20 (Flat)',
  deliveryTime: '30-40 Mins',
  handlingFee: 5
};
