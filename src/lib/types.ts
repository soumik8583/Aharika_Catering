export type Dish = {
  DishID: number;
  DishCode: string;
  DishName: string;
  MainIngredients: string | null;
  SourceOfDish: string | null;
  IsVegetarian: number;
  MasalasUsed: string | null;
  ImageURL: string | null;
  Category: string | null;
  Description: string | null;
  IsActive: number;
  CreatedAt: string;
  UpdatedAt: string;
};

export type Menu = {
  MenuID: number;
  MenuName: string;
  Description: string | null;
  Price: number | null;
  PriceUnit: string | null;
  ImageURL: string | null;
  Category: string | null;
  IsActive: number;
  CreatedAt: string;
  UpdatedAt: string;
  dishes?: Dish[];
};

export type Order = {
  OrderID: number;
  MenuID: number | null;
  Name: string;
  ContactNumber: string;
  Email: string;
  AreaOfService: string | null;
  GuestCount: number | null;
  AdditionalRequest: string | null;
  IsCustom: number;
  OrderStatus: string;
  CreatedAt: string;
  UpdatedAt: string;
  MenuName?: string | null;
};

export type ContactEnquiry = {
  ContactID: number;
  FullName: string;
  ContactNumber: string;
  Email: string;
  Message: string;
  Status: string;
  Notes: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

export type Testimonial = {
  TestimonialID: number;
  Name: string;
  Email: string | null;
  Rating: number;
  Feedback: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type CustomDishRequest = {
  RequestID: number;
  Name: string;
  ContactNumber: string;
  Email: string;
  DishDetails: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export const DISH_CATEGORIES = [
  "Starter",
  "Main Course",
  "Rice",
  "Bread",
  "Chinese",
  "Mughlai",
  "Bengali",
  "Dessert",
  "Beverage",
  "Side Dish",
] as const;

export const ORDER_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export const CONTACT_STATUSES = ["New", "In Progress", "Contacted", "Closed"] as const;
export const TESTIMONIAL_STATUSES = ["Pending", "Approved", "Rejected"] as const;
export const CUSTOM_DISH_STATUSES = ["New", "Contacted", "Completed", "Closed"] as const;
