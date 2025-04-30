import { DisasterInfo } from "@/types";

export const disasterInfo: DisasterInfo[] = [
  {
    type: "flood",
    name: "Flood",
    description: "Floods are one of the most common natural disasters and can occur anywhere. They happen when water overflows onto normally dry land, often after heavy rainfall, rapid snow melt, or dam failures.",
    beforeTips: [
      "Know your area's flood risk and evacuation routes",
      "Prepare an emergency kit with food, water, and medications",
      "Move valuable items to higher floors",
      "Consider flood insurance if you're in a high-risk area",
      "Install check valves in plumbing to prevent backflow"
    ],
    duringTips: [
      "Evacuate immediately if ordered to do so",
      "Move to higher ground away from rivers, streams, and creeks",
      "Do not walk, swim, or drive through flood waters",
      "Stay off bridges over fast-moving water",
      "Disconnect utilities if instructed by authorities"
    ],
    afterTips: [
      "Return home only when authorities say it's safe",
      "Avoid walking or driving through flood waters",
      "Use caution when entering buildings",
      "Clean and disinfect everything that got wet",
      "Document damage for insurance claims"
    ],
    iconName: "droplets",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "earthquake",
    name: "Earthquake",
    description: "Earthquakes are sudden, rapid shaking of the ground caused by the shifting of rocks deep beneath the earth's surface. They can happen without warning and can be followed by aftershocks.",
    beforeTips: [
      "Secure heavy furniture and objects that could fall",
      "Know where and how to shut off utilities",
      "Practice drop, cover, and hold on drills",
      "Prepare an emergency kit with food, water, and medications",
      "Identify safe spots in each room (under sturdy furniture)"
    ],
    duringTips: [
      "Drop, cover, and hold on",
      "If indoors, stay there until shaking stops",
      "If in bed, stay there and protect your head with a pillow",
      "If outdoors, move to a clear area away from buildings",
      "If driving, pull over safely away from buildings and trees"
    ],
    afterTips: [
      "Expect aftershocks",
      "Check yourself and others for injuries",
      "Look for and extinguish small fires",
      "Inspect your home for damage",
      "Be careful around broken glass and debris"
    ],
    iconName: "activity",
    imageUrl: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "wildfire",
    name: "Wildfire",
    description: "Wildfires are unplanned, uncontrolled fires that burn in natural areas like forests, grasslands, or prairies. They can be caused by humans or natural phenomena like lightning.",
    beforeTips: [
      "Create a defensible space around your home",
      "Use fire-resistant materials for home construction",
      "Keep emergency supplies in your car",
      "Develop an evacuation plan with multiple routes",
      "Sign up for emergency alerts in your area"
    ],
    duringTips: [
      "Evacuate immediately if ordered to do so",
      "If trapped, call 911 and shelter in a room away from the fire",
      "Close all doors and windows but leave them unlocked",
      "Fill sinks and tubs with cold water",
      "Keep informed through emergency radio or alerts"
    ],
    afterTips: [
      "Return home only when authorities say it's safe",
      "Watch for hot spots and report any smoke",
      "Use caution when entering burned areas",
      "Check roof and attic for sparks or embers",
      "Document damage for insurance claims"
    ],
    iconName: "flame",
    imageUrl: "https://images.unsplash.com/photo-1602444444472-8f7b25223948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "hurricane",
    name: "Hurricane",
    description: "Hurricanes are massive storm systems that form over warm ocean waters and move toward land. They can cause catastrophic damage from heavy rainfall, high winds, and storm surges.",
    beforeTips: [
      "Know your evacuation zone and route",
      "Prepare an emergency kit with food, water, and medications",
      "Secure or bring inside outdoor furniture and objects",
      "Install storm shutters or board up windows",
      "Fill your car's gas tank and get extra cash"
    ],
    duringTips: [
      "Evacuate if told to do so",
      "If sheltering in place, stay in a small, interior room away from windows",
      "Listen to a battery-powered radio for updates",
      "Turn refrigerator to coldest setting and keep doors closed",
      "Stay inside during the eye of the storm"
    ],
    afterTips: [
      "Return home only when authorities say it's safe",
      "Watch for downed power lines and avoid floodwaters",
      "Take photos of damage for insurance claims",
      "Wear protective clothing during clean-up",
      "Be aware of potential gas leaks"
    ],
    iconName: "wind",
    imageUrl: "https://images.unsplash.com/photo-1569282155544-048af7ffe7f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "tornado",
    name: "Tornado",
    description: "Tornadoes are violently rotating columns of air that extend from a thunderstorm to the ground. They can destroy buildings, uproot trees, and throw vehicles hundreds of yards.",
    beforeTips: [
      "Know the signs of a tornado (dark, greenish sky; large hail; loud roar)",
      "Identify a safe room in your home (basement, storm cellar, interior room)",
      "Practice tornado drills with your family",
      "Have emergency supplies ready",
      "Sign up for local emergency alerts"
    ],
    duringTips: [
      "Go to your safe room immediately",
      "If in a building, go to a small interior room on the lowest floor",
      "Stay away from windows, doors, and outside walls",
      "If in a vehicle, do not try to outrun a tornado",
      "If outside with no shelter, lie flat in a nearby ditch"
    ],
    afterTips: [
      "Check for injuries and provide first aid",
      "Watch out for debris and downed power lines",
      "Stay out of damaged buildings",
      "Use phones only for emergency calls",
      "Document damage for insurance claims"
    ],
    iconName: "tornado",
    imageUrl: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "tsunami",
    name: "Tsunami",
    description: "Tsunamis are giant waves caused by earthquakes or volcanic eruptions under the sea. They can travel across entire oceans and cause extensive destruction when they hit land.",
    beforeTips: [
      "Know if you live in a tsunami hazard zone",
      "Learn evacuation routes to higher ground",
      "Prepare an emergency kit with food, water, and medications",
      "Have a family emergency plan",
      "Know the natural warning signs (strong earthquake, unusual sea behavior)"
    ],
    duringTips: [
      "If you feel a strong earthquake near the coast, move inland or to higher ground immediately",
      "If you see the water recede unusually, move to higher ground immediately",
      "Follow evacuation orders from officials",
      "Stay away from the coast until officials say it's safe",
      "If caught in a tsunami wave, grab onto something that floats"
    ],
    afterTips: [
      "Return home only when authorities say it's safe",
      "Stay away from damaged buildings and bridges",
      "Avoid floodwaters which may be contaminated",
      "Check for injuries and provide first aid",
      "Be aware of potential secondary hazards"
    ],
    iconName: "waves",
    imageUrl: "https://images.unsplash.com/photo-1623972912314-4b1a8e6ce94d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "winter_storm",
    name: "Winter Storm",
    description: "Winter storms can bring freezing temperatures, heavy snow, ice, sleet, and dangerous wind chills. They can cause power outages, transportation disruptions, and hypothermia.",
    beforeTips: [
      "Prepare your home with insulation, caulking, and weather stripping",
      "Have emergency heating equipment and fuel",
      "Stock up on food, water, and medications",
      "Keep a winter survival kit in your vehicle",
      "Learn the signs of frostbite and hypothermia"
    ],
    duringTips: [
      "Stay indoors and dress warmly",
      "Conserve fuel by keeping your house cooler than normal",
      "Close off unused rooms",
      "Eat regularly and drink plenty of fluids",
      "If you must go outside, wear layers of warm clothing"
    ],
    afterTips: [
      "Clear snow safely (avoid overexertion)",
      "Check on neighbors, especially elderly or disabled",
      "Be careful driving on snow and ice",
      "Watch for signs of frostbite and hypothermia",
      "Deal with frozen pipes properly"
    ],
    iconName: "snowflake",
    imageUrl: "https://images.unsplash.com/photo-1612208695882-02f2322b7fee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "extreme_heat",
    name: "Extreme Heat",
    description: "Extreme heat is a period of high heat and humidity with temperatures above 90 degrees for at least two to three days. It can lead to heat-related illnesses like heat exhaustion and heat stroke.",
    beforeTips: [
      "Install window air conditioners snugly",
      "Check air-conditioning ducts for proper insulation",
      "Install temporary window reflectors",
      "Cover windows that receive morning or afternoon sun",
      "Learn to recognize heat-related illness symptoms"
    ],
    duringTips: [
      "Stay in air-conditioned buildings as much as possible",
      "Drink more water than usual",
      "Avoid using the stove or oven to cook",
      "Wear lightweight, light-colored clothing",
      "Take cool showers or baths"
    ],
    afterTips: [
      "Continue to hydrate",
      "Check on family, friends, and neighbors",
      "Monitor those at high risk",
      "Watch for signs of heat-related illnesses",
      "Gradually resume normal activities"
    ],
    iconName: "thermometer-sun",
    imageUrl: "https://images.unsplash.com/photo-1524594081293-190a2fe0baae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    type: "pandemic",
    name: "Pandemic",
    description: "A pandemic is an epidemic of an infectious disease that has spread across a large region, affecting a substantial number of people. Recent examples include COVID-19.",
    beforeTips: [
      "Stock up on non-perishable food, medications, and supplies",
      "Create a household plan of action",
      "Practice good personal hygiene habits",
      "Stay informed about the disease and local policies",
      "Prepare for possible school or workplace closures"
    ],
    duringTips: [
      "Follow public health guidelines",
      "Practice social distancing",
      "Wear appropriate protective equipment if recommended",
      "Clean and disinfect frequently touched surfaces",
      "Monitor your health and the health of family members"
    ],
    afterTips: [
      "Continue to follow health guidelines during recovery phases",
      "Get vaccinated if vaccines are available",
      "Support local businesses and community recovery",
      "Be aware of mental health impacts",
      "Prepare for possible future waves"
    ],
    iconName: "virus",
    imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];