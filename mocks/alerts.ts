import { Alert } from "@/types";

export const alerts: Alert[] = [
  {
    id: "1",
    type: "flood",
    title: "Flash Flood Warning",
    description: "Heavy rainfall causing flash flooding in low-lying areas. Expect rapid rises in small streams and creeks.",
    level: "high",
    location: "London",
    date: "2023-11-15T08:30:00Z",
    isActive: true,
    source: "Met Office",
    instructions: [
      "Move to higher ground immediately",
      "Do not walk, swim, or drive through flood waters",
      "Stay off bridges over fast-moving water",
      "Evacuate if told to do so"
    ]
  },
  {
    id: "2",
    type: "winter_storm",
    title: "Winter Storm Advisory",
    description: "Snow accumulation of 3-5 inches expected overnight with temperatures dropping below freezing.",
    level: "medium",
    location: "Manchester",
    date: "2023-12-01T16:45:00Z",
    isActive: true,
    source: "Met Office",
    instructions: [
      "Stay indoors during the storm if possible",
      "Keep emergency supplies ready",
      "Dress warmly if you must go outside",
      "Be cautious on roads as they may be slippery"
    ]
  },
  {
    id: "3",
    type: "extreme_heat",
    title: "Heat Wave Alert",
    description: "Temperatures expected to reach 35°C (95°F) for the next three days. High humidity will make it feel even hotter.",
    level: "high",
    location: "Birmingham",
    date: "2023-07-20T10:15:00Z",
    isActive: true,
    source: "Met Office",
    instructions: [
      "Stay in air-conditioned buildings when possible",
      "Drink plenty of fluids",
      "Wear lightweight, light-colored clothing",
      "Check on vulnerable neighbors and relatives"
    ]
  },
  {
    id: "4",
    type: "wildfire",
    title: "Wildfire Risk",
    description: "Extremely dry conditions have created high wildfire risk in wooded areas. Avoid outdoor burning.",
    level: "medium",
    location: "Edinburgh",
    date: "2023-08-05T14:20:00Z",
    isActive: true,
    source: "Scottish Fire and Rescue Service",
    instructions: [
      "Avoid activities that could cause fires",
      "Report any smoke or fire immediately",
      "Be prepared to evacuate if necessary",
      "Keep emergency supplies ready"
    ]
  },
  {
    id: "5",
    type: "tornado",
    title: "Tornado Watch",
    description: "Conditions are favorable for tornado development in the next few hours.",
    level: "medium",
    location: "Leeds",
    date: "2023-06-10T18:30:00Z",
    isActive: false,
    source: "Met Office",
    instructions: [
      "Be prepared to take shelter",
      "Keep a battery-powered weather radio handy",
      "Secure outdoor objects that could blow away",
      "Stay tuned for further updates"
    ]
  }
];