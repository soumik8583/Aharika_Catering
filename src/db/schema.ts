/**
 * Database schema definition for Aaharika_Catering (Turso / libSQL).
 * Exported as an array of DDL statements executed by the migrate script.
 */
export const schemaStatements: string[] = [
  // ---------------- Admin ----------------
  `CREATE TABLE IF NOT EXISTS Admin (
    AdminID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    ContactNumber TEXT,
    PasswordHash TEXT NOT NULL,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_admin_email ON Admin(Email)`,

  // ---------------- Dish ----------------
  `CREATE TABLE IF NOT EXISTS Dish (
    DishID INTEGER PRIMARY KEY AUTOINCREMENT,
    DishCode TEXT NOT NULL UNIQUE,
    DishName TEXT NOT NULL,
    MainIngredients TEXT,
    SourceOfDish TEXT,
    IsVegetarian INTEGER NOT NULL DEFAULT 1,
    MasalasUsed TEXT,
    ImageURL TEXT,
    Category TEXT,
    Description TEXT,
    Price REAL,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_dish_code ON Dish(DishCode)`,
  `CREATE INDEX IF NOT EXISTS idx_dish_category ON Dish(Category)`,
  `CREATE INDEX IF NOT EXISTS idx_dish_active ON Dish(IsActive)`,

  // ---------------- Menu ----------------
  `CREATE TABLE IF NOT EXISTS Menu (
    MenuID INTEGER PRIMARY KEY AUTOINCREMENT,
    MenuName TEXT NOT NULL,
    Description TEXT,
    Price REAL,
    PriceUnit TEXT DEFAULT 'Per Guest',
    ImageURL TEXT,
    Category TEXT,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_menu_active ON Menu(IsActive)`,
  `CREATE INDEX IF NOT EXISTS idx_menu_category ON Menu(Category)`,

  // ---------------- MenuDish (many-to-many) ----------------
  `CREATE TABLE IF NOT EXISTS MenuDish (
    MenuDishID INTEGER PRIMARY KEY AUTOINCREMENT,
    MenuID INTEGER NOT NULL,
    DishID INTEGER NOT NULL,
    DisplayOrder INTEGER DEFAULT 0,
    FOREIGN KEY (MenuID) REFERENCES Menu(MenuID) ON DELETE CASCADE,
    FOREIGN KEY (DishID) REFERENCES Dish(DishID) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_menudish_menu ON MenuDish(MenuID)`,
  `CREATE INDEX IF NOT EXISTS idx_menudish_dish ON MenuDish(DishID)`,

  // ---------------- Orders ----------------
  `CREATE TABLE IF NOT EXISTS Orders (
    OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
    MenuID INTEGER,
    Name TEXT NOT NULL,
    ContactNumber TEXT NOT NULL,
    Email TEXT NOT NULL,
    AreaOfService TEXT,
    GuestCount INTEGER,
    AdditionalRequest TEXT,
    IsCustom INTEGER NOT NULL DEFAULT 0,
    OrderStatus TEXT NOT NULL DEFAULT 'New',
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (MenuID) REFERENCES Menu(MenuID) ON DELETE SET NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON Orders(OrderStatus)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_email ON Orders(Email)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_created ON Orders(CreatedAt)`,

  // ---------------- OrderItems (custom menu dishes for an order) ----------------
  `CREATE TABLE IF NOT EXISTS OrderItems (
    OrderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderID INTEGER NOT NULL,
    DishID INTEGER NOT NULL,
    Notes TEXT,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (DishID) REFERENCES Dish(DishID) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orderitems_order ON OrderItems(OrderID)`,

  // ---------------- ContactUs ----------------
  `CREATE TABLE IF NOT EXISTS ContactUs (
    ContactID INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName TEXT NOT NULL,
    ContactNumber TEXT NOT NULL,
    Email TEXT NOT NULL,
    Message TEXT NOT NULL,
    Status TEXT NOT NULL DEFAULT 'New',
    Notes TEXT,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_contact_status ON ContactUs(Status)`,
  `CREATE INDEX IF NOT EXISTS idx_contact_created ON ContactUs(CreatedAt)`,

  // ---------------- Testimonials ----------------
  `CREATE TABLE IF NOT EXISTS Testimonials (
    TestimonialID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT,
    Rating INTEGER NOT NULL DEFAULT 5,
    Feedback TEXT NOT NULL,
    Status TEXT NOT NULL DEFAULT 'Pending',
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_testimonials_status ON Testimonials(Status)`,

  // ---------------- CustomDishRequests ----------------
  `CREATE TABLE IF NOT EXISTS CustomDishRequests (
    RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    ContactNumber TEXT NOT NULL,
    Email TEXT NOT NULL,
    DishDetails TEXT NOT NULL,
    Status TEXT NOT NULL DEFAULT 'New',
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_customdish_status ON CustomDishRequests(Status)`,
];
