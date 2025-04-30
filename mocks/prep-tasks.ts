import { PrepTask } from "@/types";

export const prepTasks: PrepTask[] = [
  {
    id: "1",
    title: "Create an Emergency Kit",
    description: "Assemble a basic emergency supply kit with water, food, first aid supplies, and other essentials.",
    points: 100,
    isCompleted: false,
    category: "supplies",
    disasterTypes: ["flood", "earthquake", "hurricane", "tornado", "winter_storm", "wildfire", "tsunami", "pandemic"],
    steps: [
      "Gather a 3-day supply of non-perishable food",
      "Store 1 gallon of water per person per day for at least 3 days",
      "Include a first aid kit with essential medications",
      "Add a flashlight, battery-powered radio, and extra batteries",
      "Include a whistle, dust mask, plastic sheeting, and duct tape",
      "Don't forget moist towelettes, garbage bags, and plastic ties",
      "Include a wrench or pliers to turn off utilities",
      "Add local maps and a manual can opener",
      "Include cell phone with chargers and a backup battery"
    ],
    imageUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "2",
    title: "Create a Family Emergency Plan",
    description: "Develop a plan for how your family will communicate and reunite during an emergency.",
    points: 75,
    isCompleted: false,
    category: "planning",
    disasterTypes: ["flood", "earthquake", "hurricane", "tornado", "winter_storm", "wildfire", "tsunami", "pandemic"],
    steps: [
      "Identify meeting places both in your neighborhood and outside your area",
      "Document emergency contact information for all family members",
      "Choose an out-of-town contact person everyone can call",
      "Know evacuation routes from your home and community",
      "Plan how to care for pets during an emergency",
      "Document important medical information for each family member",
      "Practice your plan with all family members",
      "Review and update your plan annually"
    ],
    imageUrl: "https://images.unsplash.com/photo-1591522810850-58128c5fb089?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "3",
    title: "Learn Basic First Aid",
    description: "Learn essential first aid skills to help yourself and others during an emergency.",
    points: 50,
    isCompleted: false,
    category: "skills",
    disasterTypes: ["flood", "earthquake", "hurricane", "tornado", "winter_storm", "wildfire", "tsunami", "pandemic", "extreme_heat"],
    steps: [
      "Take a certified first aid course",
      "Learn CPR and how to use an AED",
      "Practice treating bleeding, burns, and fractures",
      "Learn how to recognize and treat shock",
      "Understand how to handle choking emergencies",
      "Learn to recognize signs of heat exhaustion and heat stroke",
      "Practice bandaging techniques",
      "Learn how to create improvised splints and slings"
    ],
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "4",
    title: "Secure Your Home",
    description: "Take steps to make your home safer during disasters like earthquakes, floods, or severe storms.",
    points: 60,
    isCompleted: false,
    category: "home",
    disasterTypes: ["earthquake", "flood", "hurricane", "tornado", "wildfire"],
    steps: [
      "Secure heavy furniture to walls to prevent tipping",
      "Install storm shutters or prepare plywood covers for windows",
      "Clear gutters and downspouts regularly",
      "Trim trees and shrubs away from your home",
      "Elevate electrical systems in flood-prone areas",
      "Install check valves in plumbing to prevent backflow",
      "Reinforce garage doors against high winds",
      "Create defensible space around your home if in wildfire-prone areas"
    ],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "5",
    title: "Document Important Information",
    description: "Create copies of important documents and store them in a waterproof, portable container.",
    points: 40,
    isCompleted: false,
    category: "planning",
    disasterTypes: ["flood", "earthquake", "hurricane", "tornado", "winter_storm", "wildfire", "tsunami"],
    steps: [
      "Make copies of identification documents (passports, driver's licenses)",
      "Include insurance policies and bank account records",
      "Document medical information and prescriptions",
      "Include emergency contact information",
      "Store paper copies in a waterproof, fireproof container",
      "Create digital copies and store securely",
      "Include property deeds, titles, and birth certificates",
      "Take photos of valuable household items for insurance"
    ],
    imageUrl: "https://images.unsplash.com/photo-1568219656418-15c329312bf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "6",
    title: "Learn Water Purification Methods",
    description: "Learn different ways to make water safe for drinking during emergencies.",
    points: 30,
    isCompleted: false,
    category: "skills",
    disasterTypes: ["flood", "hurricane", "tsunami", "earthquake"],
    steps: [
      "Learn how to boil water properly (rolling boil for 1 minute)",
      "Practice using water purification tablets",
      "Learn how to use household bleach for disinfection (8 drops per gallon)",
      "Understand how to create a basic water filter",
      "Learn how to collect and store rainwater safely",
      "Practice using a commercial water filter",
      "Understand the limitations of each purification method",
      "Learn to recognize signs of waterborne illness"
    ],
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "7",
    title: "Create a Car Emergency Kit",
    description: "Prepare a kit for your vehicle in case you're stranded or need to evacuate quickly.",
    points: 45,
    isCompleted: false,
    category: "supplies",
    disasterTypes: ["winter_storm", "flood", "wildfire", "hurricane", "tornado"],
    steps: [
      "Include jumper cables, flashlight, and first aid kit",
      "Add bottled water and non-perishable snacks",
      "Include blankets or sleeping bags",
      "Add a basic tool kit and duct tape",
      "Include road flares or reflective triangles",
      "Add a car cell phone charger",
      "Include maps and a compass",
      "Add seasonal items (ice scraper, sunscreen)"
    ],
    imageUrl: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "8",
    title: "Learn Emergency Cooking Methods",
    description: "Learn how to prepare food when utilities are unavailable.",
    points: 35,
    isCompleted: false,
    category: "skills",
    disasterTypes: ["winter_storm", "hurricane", "flood", "earthquake", "wildfire"],
    steps: [
      "Learn to use a camping stove safely",
      "Practice cooking with a solar oven",
      "Learn to build and cook on a small outdoor fire safely",
      "Understand which foods don't require cooking",
      "Practice using canned heat (Sterno)",
      "Learn to use a barbecue grill safely during emergencies",
      "Understand carbon monoxide risks with indoor cooking",
      "Practice meal planning with non-perishable foods"
    ],
    imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];