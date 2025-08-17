import { ChatMessage, ChatSession } from '@/types';

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! I\'m your emergency preparedness AI assistant. How can I help you stay prepared today?',
    isUser: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    text: 'Hi! I want to know what to do during an earthquake.',
    isUser: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
  },
  {
    id: '3',
    text: 'Great question! During an earthquake, remember "Drop, Cover, and Hold On": \n\n• Drop to your hands and knees\n• Take cover under a sturdy desk or table\n• Hold on to your shelter and protect your head\n\nStay away from windows, mirrors, and heavy objects that could fall. If you\'re outdoors, move away from buildings and power lines.',
    isUser: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: '4',
    text: 'What should I include in my emergency kit?',
    isUser: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '5',
    text: 'An essential emergency kit should include:\n\n🥤 Water (1 gallon per person per day for 3 days)\n🥫 Non-perishable food (3-day supply)\n🔦 Flashlight and batteries\n📻 Battery-powered or hand crank radio\n🩹 First aid kit\n💊 Prescription medications\n📱 Cell phone chargers\n💰 Cash and credit cards\n🆔 Important documents (copies)\n🧥 Warm clothing and blankets\n\nWould you like me to help you create a personalized checklist?',
    isUser: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: '6',
    text: 'Yes, that would be great!',
    isUser: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '7',
    text: 'Perfect! I\'ll help you create a custom emergency kit checklist. First, let me ask a few questions:\n\n1. How many people are in your household?\n2. Do you have any pets?\n3. Do you live in an area prone to specific disasters (floods, hurricanes, earthquakes)?\n4. Does anyone have special medical needs?',
    isUser: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
];

export const mockChatSessions: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Emergency Kit Planning',
    messages: mockChatMessages,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'session-2',
    title: 'Earthquake Preparedness',
    messages: [
      {
        id: 'msg-1',
        text: 'What should I do to prepare for earthquakes?',
        isUser: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: 'msg-2',
        text: 'Here are key earthquake preparedness steps:\n\n🏠 **Secure your home:**\n• Bolt heavy furniture to walls\n• Install safety latches on cabinets\n• Secure water heater and appliances\n\n📦 **Prepare supplies:**\n• Keep emergency kit accessible\n• Store water and food supplies\n• Have a battery-powered radio\n\n📱 **Make a plan:**\n• Identify safe spots in each room\n• Practice drop drills with family\n• Establish meeting points\n\nWould you like specific advice for any of these areas?',
        isUser: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 120).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 120).toISOString(),
  },
  {
    id: 'session-3',
    title: 'Hurricane Season Prep',
    messages: [
      {
        id: 'msg-3',
        text: 'Hurricane season is coming. What should I do?',
        isUser: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      },
      {
        id: 'msg-4',
        text: 'Great timing to prepare! Here\'s your hurricane prep checklist:\n\n🌪️ **Before Hurricane Season:**\n• Review insurance policies\n• Trim trees near your home\n• Install storm shutters or plywood\n• Stock up on supplies early\n\n⚠️ **When Hurricane Approaches:**\n• Monitor weather alerts\n• Fill bathtub with water\n• Charge all devices\n• Secure outdoor items\n\n🏠 **During Hurricane:**\n• Stay indoors, away from windows\n• Have emergency kit ready\n• Listen to weather radio\n\nNeed help with any specific preparation area?',
        isUser: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48 + 180).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48 + 180).toISOString(),
  },
];

// Helper function to generate AI responses (for demo purposes)
export const generateAIResponse = (userMessage: string): string => {
  const responses = {
    earthquake: "For earthquake safety, remember 'Drop, Cover, and Hold On':\n\n🏠 **Drop** to your hands and knees\n🛡️ **Cover** under a sturdy desk or table\n🤝 **Hold on** to your shelter and protect your head\n\nStay away from windows, mirrors, and heavy objects that could fall. If you're outdoors, move away from buildings and power lines.\n\nWould you like me to help you create an earthquake preparedness checklist?",
    
    fire: "In case of fire, follow these critical steps:\n\n🔥 **Stay low** to avoid smoke inhalation\n🚪 **Feel doors** before opening (hot door = fire behind it)\n🏃 **Have multiple escape routes** planned\n📞 **Call 911** once you're safely outside\n\n⚠️ **Never use elevators** during a fire\n🚫 **Don't go back inside** for belongings\n\nNeed help creating a fire escape plan for your home?",
    
    flood: "During flooding, remember these safety rules:\n\n🌊 **Turn Around, Don't Drown** - Never drive through flooded roads\n📏 Just **6 inches** of water can knock you down\n🚗 **12 inches** can carry away a vehicle\n⬆️ **Move to higher ground** immediately\n\n🔌 **Avoid electrical hazards** in standing water\n📻 **Stay informed** with weather radio updates\n\nWant guidance on creating a flood emergency kit?",
    
    hurricane: "Hurricane preparation is crucial - here's your action plan:\n\n🌀 **Before Hurricane Season:**\n• Review insurance policies\n• Trim trees near your home\n• Install storm shutters\n• Stock emergency supplies\n\n⚠️ **When Hurricane Approaches:**\n• Monitor weather alerts closely\n• Fill bathtub with water\n• Charge all electronic devices\n• Secure outdoor furniture\n\n🏠 **During Hurricane:**\n• Stay indoors, away from windows\n• Keep emergency kit accessible\n• Listen to weather radio\n\nNeed help with a specific preparation area?",
    
    tornado: "Tornado safety - every second counts:\n\n🌪️ **Tornado Watch** = Conditions are right\n🚨 **Tornado Warning** = Tornado spotted or on radar\n\n🏠 **Safe Places:**\n• Lowest floor of sturdy building\n• Interior room without windows\n• Under heavy table or desk\n\n❌ **Avoid:**\n• Mobile homes, cars, outdoors\n• Windows and large roof areas\n• Upper floors\n\nWant me to help you identify safe spots in your home?",
    
    evacuation: "Evacuation planning essentials:\n\n🎒 **Go-Bag Preparation:**\n• Important documents (copies)\n• Prescription medications\n• Cash and credit cards\n• Change of clothes\n• Phone chargers\n\n🗺️ **Route Planning:**\n• Plan multiple evacuation routes\n• Identify shelter locations\n• Establish family meeting points\n• Practice with family members\n\n📞 **Communication Plan:**\n• Designate out-of-state contact\n• Share plan with family/friends\n\nShould I help you create a personalized evacuation checklist?",
    
    supplies: "Essential emergency supplies checklist:\n\n💧 **Water:** 1 gallon per person per day (minimum 3 days)\n🥫 **Food:** 3-day supply of non-perishable food\n🔦 **Light & Power:** Flashlights, batteries, radio\n🩹 **Medical:** First aid kit, prescription medications\n📱 **Communication:** Phone chargers, battery bank\n💰 **Finance:** Cash, credit cards, important documents\n🧥 **Clothing:** Weather-appropriate clothing, blankets\n\n🐕 **Don't forget pets:** Food, water, carriers, medications\n\nWould you like me to customize this list for your specific situation?",
    
    communication: "Emergency communication planning:\n\n📞 **Key Contacts:**\n• Local emergency services\n• Out-of-state family contact\n• Work, school, daycare numbers\n• Insurance companies\n• Utility companies\n\n📻 **Communication Tools:**\n• Battery/hand-crank radio\n• NOAA Weather Radio\n• Charged cell phones + chargers\n• Two-way radios for family\n\n💾 **Important Information:**\n• Store contacts in multiple places\n• Include medical information\n• Keep copies of important documents\n\nNeed help setting up your emergency contact list?",
    
    pets: "Pet emergency preparedness:\n\n🐾 **Essential Pet Supplies:**\n• Food and water (3+ days)\n• Medications and medical records\n• Carriers/cages for transport\n• Leashes, collars with ID tags\n• Waste bags and litter\n• Comfort items (toys, blankets)\n\n🏠 **Shelter Planning:**\n• Research pet-friendly shelters\n• Identify pet-friendly hotels\n• Connect with friends/family who could help\n• Consider boarding facilities\n\n📋 **Important Documents:**\n• Vaccination records\n• Photos of pets\n• Emergency vet contacts\n\nWould you like help creating a specific emergency plan for your pets?",
    
    kit: "Let's build your customized emergency kit! First, tell me:\n\n👥 **Household Size:** How many people?\n🐕 **Pets:** Any animals to include?\n🏠 **Location:** What disasters are common in your area?\n💊 **Medical Needs:** Any special medications or conditions?\n\nBased on your answers, I'll create a personalized checklist with:\n• Specific quantities needed\n• Storage recommendations\n• Maintenance schedules\n• Budget-friendly alternatives\n\nWhat's your household size?",
    
    checklist: "I'd love to help you create a custom preparedness checklist! \n\n📝 **Available Checklists:**\n• 72-hour emergency kit\n• Evacuation go-bag\n• Home safety audit\n• Communication plan\n• Pet preparedness\n• Seasonal disaster prep\n• Vehicle emergency kit\n\n🎯 **Personalized Options:**\nAnswer a few questions and I'll customize any checklist for your specific needs, location, and family situation.\n\nWhich type of checklist interests you most?",
    
    help: "I'm your emergency preparedness AI assistant! Here's how I can help:\n\n🆘 **Disaster Guidance:**\n• Earthquake, fire, flood, hurricane safety\n• What to do before, during, and after disasters\n\n📦 **Emergency Planning:**\n• Building emergency kits\n• Creating evacuation plans\n• Family communication strategies\n\n✅ **Custom Checklists:**\n• Personalized preparedness lists\n• Seasonal preparation reminders\n• Step-by-step action plans\n\n🎓 **Education:**\n• Disaster preparedness basics\n• Safety tips and best practices\n• Risk assessment for your area\n\nWhat specific topic would you like to explore?",
    
    thanks: "You're very welcome! 😊 Staying prepared is one of the best gifts you can give yourself and your family.\n\n🌟 **Remember:**\n• Small steps lead to big preparedness\n• Review and update plans regularly\n• Practice makes perfect\n• Being prepared brings peace of mind\n\nI'm always here when you need guidance on emergency preparedness. Feel free to ask about any disaster scenarios, planning tips, or specific situations you want to prepare for!\n\nStay safe and prepared! 💪",
    
    default: "I'm here to help with emergency preparedness! I can provide guidance on:\n\n🌪️ **Natural Disasters:** Earthquakes, hurricanes, floods, tornadoes, wildfires\n🔥 **Emergency Planning:** Evacuation routes, communication plans, family meeting points\n📦 **Emergency Kits:** What to include, how much to store, where to keep supplies\n🏠 **Home Safety:** Disaster-proofing, safe rooms, emergency shutoffs\n🐕 **Pet Preparedness:** Including animals in your emergency plans\n\nWhat specific aspect of emergency preparedness would you like to learn about? Just ask, and I'll provide detailed, actionable guidance!"
  };

  const message = userMessage.toLowerCase();
  
  // Check for specific keywords and return appropriate responses
  if (message.includes('earthquake') || message.includes('quake')) return responses.earthquake;
  if (message.includes('fire') || message.includes('wildfire')) return responses.fire;
  if (message.includes('flood') || message.includes('flooding')) return responses.flood;
  if (message.includes('hurricane') || message.includes('typhoon')) return responses.hurricane;
  if (message.includes('tornado') || message.includes('twister')) return responses.tornado;
  if (message.includes('evacuat')) return responses.evacuation;
  if (message.includes('supplies') || message.includes('emergency kit')) return responses.supplies;
  if (message.includes('communication') || message.includes('contact')) return responses.communication;
  if (message.includes('pet') || message.includes('dog') || message.includes('cat') || message.includes('animal')) return responses.pets;
  if (message.includes('kit') && !message.includes('emergency kit')) return responses.kit;
  if (message.includes('checklist') || message.includes('list')) return responses.checklist;
  if (message.includes('help') || message.includes('what can you do')) return responses.help;
  if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) return responses.thanks;
  
  return responses.default;
};
