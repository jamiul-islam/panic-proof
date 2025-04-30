import { Resource } from "@/types";

export const resources: Resource[] = [
  {
    id: "1",
    title: "Emergency Services",
    description: "Call 999 for immediate emergency assistance from police, fire, or ambulance services.",
    category: "emergency",
    contactPhone: "999",
    website: "https://www.gov.uk/dial-999",
    disasterTypes: ["flood", "earthquake", "wildfire", "hurricane", "tornado", "tsunami", "winter_storm", "extreme_heat", "pandemic"]
  },
  {
    id: "2",
    title: "NHS 111",
    description: "For urgent medical help when it's not a life-threatening emergency.",
    category: "medical",
    contactPhone: "111",
    website: "https://111.nhs.uk/",
    disasterTypes: ["flood", "earthquake", "wildfire", "hurricane", "tornado", "tsunami", "winter_storm", "extreme_heat", "pandemic"]
  },
  {
    id: "3",
    title: "Met Office Weather Warnings",
    description: "Official UK weather warnings and forecasts to help you prepare for severe weather.",
    category: "information",
    website: "https://www.metoffice.gov.uk/weather/warnings-and-advice",
    disasterTypes: ["flood", "hurricane", "tornado", "winter_storm", "extreme_heat"]
  },
  {
    id: "4",
    title: "Environment Agency Flood Information",
    description: "Check flood warnings and river levels in your area.",
    category: "information",
    contactPhone: "0345 988 1188",
    website: "https://flood-warning-information.service.gov.uk/",
    disasterTypes: ["flood"]
  },
  {
    id: "5",
    title: "British Red Cross Emergency App",
    description: "Free app with first aid advice and emergency alerts for various situations.",
    category: "information",
    website: "https://www.redcross.org.uk/get-help/prepare-for-emergencies/free-emergency-apps",
    disasterTypes: ["flood", "earthquake", "wildfire", "hurricane", "tornado", "tsunami", "winter_storm", "extreme_heat", "pandemic"]
  },
  {
    id: "6",
    title: "Local Council Emergency Housing",
    description: "Contact your local council for emergency housing assistance after a disaster.",
    category: "shelter",
    website: "https://www.gov.uk/find-local-council",
    disasterTypes: ["flood", "earthquake", "wildfire", "hurricane", "tornado", "tsunami", "winter_storm"]
  },
  {
    id: "7",
    title: "National Grid Gas Emergency",
    description: "Report a gas leak or emergency.",
    category: "utilities",
    contactPhone: "0800 111 999",
    website: "https://www.nationalgrid.com/uk/gas-transmission/safety-and-emergencies",
    disasterTypes: ["earthquake", "flood", "winter_storm"]
  },
  {
    id: "8",
    title: "UK Power Networks",
    description: "Report power cuts and get updates on electricity supply issues.",
    category: "utilities",
    contactPhone: "105",
    website: "https://www.ukpowernetworks.co.uk/power-cut/",
    disasterTypes: ["flood", "hurricane", "tornado", "winter_storm"]
  },
  {
    id: "9",
    title: "National Highways Traffic Information",
    description: "Get updates on road conditions and closures during emergencies.",
    category: "transportation",
    contactPhone: "0300 123 5000",
    website: "https://nationalhighways.co.uk/travel-updates/",
    disasterTypes: ["flood", "winter_storm", "wildfire"]
  },
  {
    id: "10",
    title: "GOV.UK Emergency Preparation",
    description: "Official government advice on preparing for and dealing with emergencies.",
    category: "information",
    website: "https://www.gov.uk/government/publications/preparing-for-emergencies/preparing-for-emergencies",
    disasterTypes: ["flood", "earthquake", "wildfire", "hurricane", "tornado", "tsunami", "winter_storm", "extreme_heat", "pandemic"]
  }
];