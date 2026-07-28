export type DayId =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "saturday"
  | "friday";

export type MealPreference = "veg" | "non-veg";

export type DayMenu = {
  id: DayId;
  label: string;
  short: string;
  dessert: string | null;
  dessertImage: string | null;
  mealImage: string;
  /** Shared dishes always included */
  staples: string[];
  /** When both exist, UI offers a veg / non-veg toggle */
  vegOption: string | null;
  nonVegOption: string | null;
  /** Only on 6-day plan */
  sixDayOnly?: boolean;
  isOff?: boolean;
};

export const WEEKLY_MENU: DayMenu[] = [
  {
    id: "sunday",
    label: "Sunday",
    short: "Sun",
    dessert: "Gulab jamun",
    dessertImage: "/menu/desserts/gulab-jamun.jpg",
    mealImage: "/menu/meals/sunday-lemon-rice.jpg",
    staples: ["Lemon rice", "Gobi masala", "Chapathi (3)", "Dal", "Salad"],
    vegOption: null,
    nonVegOption: null,
  },
  {
    id: "monday",
    label: "Monday",
    short: "Mon",
    dessert: "Kheer",
    dessertImage: "/menu/desserts/kheer.jpg",
    mealImage: "/menu/meals/monday-jeera-rice.jpg",
    staples: ["Jeera rice", "Roti (3)", "Dal", "Salad"],
    vegOption: "Corn palak",
    nonVegOption: "Chicken kadai",
  },
  {
    id: "tuesday",
    label: "Tuesday",
    short: "Tue",
    dessert: "Kesari",
    dessertImage: "/menu/desserts/kesari.jpg",
    mealImage: "/menu/meals/tuesday-pulao.jpg",
    staples: ["Pulao", "Aloo methi", "Phulka (3)", "Dal", "Salad"],
    vegOption: null,
    nonVegOption: null,
  },
  {
    id: "wednesday",
    label: "Wednesday",
    short: "Wed",
    dessert: "Fruit custard",
    dessertImage: "/menu/desserts/fruit-custard.jpg",
    mealImage: "/menu/meals/wednesday-sambar-rice.jpg",
    staples: ["Plain rice", "Sambar", "Chapathi (3)", "Dal", "Salad"],
    vegOption: "Aloo gobi",
    nonVegOption: "Chicken 65",
  },
  {
    id: "thursday",
    label: "Thursday",
    short: "Thu",
    dessert: "Semiya payasam",
    dessertImage: "/menu/desserts/semiya-payasam.jpg",
    mealImage: "/menu/meals/thursday-tomato-rice.jpg",
    staples: ["Tomato rice", "Mix veg curry", "Roti (3)", "Dal", "Salad"],
    vegOption: null,
    nonVegOption: null,
  },
  {
    id: "friday",
    label: "Friday",
    short: "Fri",
    dessert: null,
    dessertImage: null,
    mealImage: "",
    staples: [],
    vegOption: null,
    nonVegOption: null,
    isOff: true,
  },
  {
    id: "saturday",
    label: "Saturday",
    short: "Sat",
    dessert: "Halwa",
    dessertImage: "/menu/desserts/halwa.jpg",
    mealImage: "/menu/meals/saturday-ghee-rice.jpg",
    staples: ["Ghee rice", "Phulka (3)", "Dal", "Salad"],
    vegOption: "Bhindi masala",
    nonVegOption: "Mutton curry",
    sixDayOnly: true,
  },
];

export const ACTIVE_DAYS = WEEKLY_MENU.filter((d) => !d.isOff);
export const CORE_DAYS = ACTIVE_DAYS.filter((d) => !d.sixDayOnly);

const MENU_DAY_IDS = ACTIVE_DAYS.map((day) => day.id);

/** Kuwait calendar weekday → menu day id (Friday is off). */
export function getKuwaitMenuDayId(now: Date = new Date()): DayId | null {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuwait",
    weekday: "long",
  })
    .format(now)
    .toLowerCase();

  if (weekday === "friday") return null;
  if ((MENU_DAY_IDS as string[]).includes(weekday)) {
    return weekday as DayId;
  }
  return null;
}

