/**
 * Database Seeding Script for Panic Proof
 * 
 * This script populates the Supabase database with initial data from the mock files.
 * Run this script after creating the database schema to have test data available.
 * 
 * Usage: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://vczquvzjwzdclcmdhuqt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjenF1dnpqd3pkY2xjbWRodXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODU1NTksImV4cCI6MjA3MDY2MTU1OX0.dmKEvfcXcUgW1HzMDMe_2LCpInO0fjQ8Db42PUDCf_Y';

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Import mock data
const mockAlerts = [
  {
    id: 'alert-1',
    type: 'flood' as const,
    title: 'Flood Warning - Downtown Area',
    description: 'Heavy rainfall has caused water levels to rise rapidly in the downtown area. Residents in low-lying areas should move to higher ground immediately.',
    level: 'high' as const,
    location: 'Downtown District',
    source: 'National Weather Service',
    instructions: [
      'Move to higher ground immediately',
      'Avoid walking or driving through flood water',
      'Stay tuned to local emergency broadcasts',
      'Have emergency kit ready'
    ],
    isActive: true,
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: 'alert-2',
    type: 'earthquake' as const,
    title: 'Earthquake Advisory',
    description: 'A magnitude 4.2 earthquake was detected 15 miles southeast. Minor aftershocks possible in the next 24 hours.',
    level: 'medium' as const,
    location: 'Regional Area',
    source: 'USGS Earthquake Center',
    instructions: [
      'Check for damage in your area',
      'Be prepared for aftershocks',
      'Secure loose items that could fall',
      'Review your earthquake safety plan'
    ],
    isActive: true,
    timestamp: '2024-01-15T08:15:00Z'
  },
  {
    id: 'alert-3',
    type: 'wildfire' as const,
    title: 'Wildfire Watch',
    description: 'Dry conditions and high winds have created elevated fire risk. Burn restrictions are in effect.',
    level: 'medium' as const,
    location: 'Mountain Region',
    source: 'Forest Fire Service',
    instructions: [
      'No outdoor burning permitted',
      'Report smoke or fires immediately',
      'Keep evacuation routes clear',
      'Maintain defensible space around property'
    ],
    isActive: true,
    timestamp: '2024-01-14T16:45:00Z'
  }
];

const mockTasks = [
  {
    id: 'task-1',
    title: 'Create Emergency Kit',
    description: 'Assemble a basic emergency kit with essential supplies for 72 hours.',
    category: 'preparation' as const,
    difficulty: 'beginner' as const,
    estimatedTime: 30,
    points: 50,
    instructions: [
      'Gather water (1 gallon per person per day)',
      'Collect non-perishable food for 3 days',
      'Include first aid supplies',
      'Pack flashlights and batteries',
      'Add emergency radio',
      'Include important documents in waterproof container'
    ],
    supplies: ['Water containers', 'Canned food', 'First aid kit', 'Flashlight', 'Batteries', 'Radio'],
    isRequired: true
  },
  {
    id: 'task-2',
    title: 'Set Up Emergency Contacts',
    description: 'Create a list of important emergency contacts for quick access during disasters.',
    category: 'communication' as const,
    difficulty: 'beginner' as const,
    estimatedTime: 15,
    points: 25,
    instructions: [
      'Add family members and close friends',
      'Include local emergency services numbers',
      'Add utility company contact information',
      'Include insurance company contacts',
      'Share contact list with family members'
    ],
    supplies: [],
    isRequired: true
  },
  {
    id: 'task-3',
    title: 'Plan Evacuation Routes',
    description: 'Identify and practice multiple evacuation routes from your home and workplace.',
    category: 'planning' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 45,
    points: 40,
    instructions: [
      'Map primary route from home',
      'Identify alternative routes',
      'Locate evacuation shelters',
      'Practice routes with family',
      'Keep routes clear of obstacles'
    ],
    supplies: ['Maps', 'GPS device'],
    isRequired: false
  }
];

const mockResources = [
  {
    id: 'resource-1',
    title: 'Emergency Kit Essentials Guide',
    description: 'Complete guide to building your emergency preparedness kit with essential items.',
    type: 'guide' as const,
    contentUrl: 'https://example.com/emergency-kit-guide',
    thumbnailUrl: 'https://example.com/thumbnails/emergency-kit.jpg',
    category: 'general' as const,
    duration: 10,
    difficulty: 'beginner' as const,
    tags: ['emergency-kit', 'preparation', 'supplies'],
    isFeatured: true
  },
  {
    id: 'resource-2',
    title: 'Flood Safety Video',
    description: 'Learn essential flood safety techniques and what to do before, during, and after a flood.',
    type: 'video' as const,
    contentUrl: 'https://example.com/flood-safety-video',
    thumbnailUrl: 'https://example.com/thumbnails/flood-safety.jpg',
    category: 'flood' as const,
    duration: 15,
    difficulty: 'beginner' as const,
    tags: ['flood', 'safety', 'water-damage'],
    isFeatured: false
  }
];

const mockDisasters = [
  {
    type: 'flood' as const,
    title: 'Flooding',
    description: 'Flooding is one of the most common natural disasters, often caused by heavy rainfall, storm surge, or dam failure.',
    severityLevels: [
      { level: 'Minor', description: 'Minimal flooding of low-lying areas' },
      { level: 'Moderate', description: 'Some inundation of structures near streams' },
      { level: 'Major', description: 'Extensive flooding with potential for evacuations' }
    ],
    preparationTips: [
      'Know your evacuation routes',
      'Keep emergency kit stocked',
      'Install sump pump if in flood-prone area',
      'Purchase flood insurance'
    ],
    duringTips: [
      'Move to higher ground immediately',
      'Avoid walking or driving through flood water',
      'Stay informed through emergency broadcasts'
    ],
    afterTips: [
      'Wait for authorities to declare area safe',
      'Document damage with photos',
      'Contact insurance company'
    ],
    supplyList: [
      'Waterproof boots',
      'Plastic sheeting',
      'Sandbags',
      'Portable pump'
    ],
    evacuationInfo: 'If evacuation is ordered, leave immediately. Take your emergency kit and important documents.',
    warningSigns: [
      'Rapidly rising water levels',
      'Heavy sustained rainfall',
      'Dam or levee failure warnings'
    ],
    icon: 'water-drop',
    color: '#2563eb'
  },
  {
    type: 'earthquake' as const,
    title: 'Earthquake',
    description: 'Earthquakes occur when tectonic plates shift, causing ground shaking that can damage buildings and infrastructure.',
    severityLevels: [
      { level: 'Light', description: 'Magnitude 3.0-3.9 - Often not felt' },
      { level: 'Moderate', description: 'Magnitude 4.0-4.9 - Often felt, minor damage' },
      { level: 'Strong', description: 'Magnitude 5.0-5.9 - Can cause damage to weak structures' },
      { level: 'Major', description: 'Magnitude 6.0+ - Can cause serious damage' }
    ],
    preparationTips: [
      'Secure heavy furniture to walls',
      'Identify safe spots in each room',
      'Practice Drop, Cover, and Hold On',
      'Keep emergency supplies accessible'
    ],
    duringTips: [
      'Drop, Cover, and Hold On',
      'Stay where you are - do not run outside',
      'If outdoors, move away from buildings and trees'
    ],
    afterTips: [
      'Check for injuries and hazards',
      'Be prepared for aftershocks',
      'Use stairs, not elevators'
    ],
    supplyList: [
      'Wrench to turn off gas',
      'Heavy shoes or boots',
      'Work gloves',
      'Fire extinguisher'
    ],
    evacuationInfo: 'Evacuate only if building is damaged. Use stairs, never elevators.',
    warningSigns: [
      'Animals acting strangely',
      'Small tremors (foreshocks)',
      'Unusual ground tilting'
    ],
    icon: 'trending-up',
    color: '#dc2626'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // 1. Seed disaster_info table
    console.log('📋 Seeding disaster information...');
    for (const disaster of mockDisasters) {
      const { error } = await supabase
        .from('disaster_info')
        .upsert({
          type: disaster.type,
          title: disaster.title,
          description: disaster.description,
          severity_levels: disaster.severityLevels,
          preparation_tips: disaster.preparationTips,
          during_disaster_tips: disaster.duringTips,
          after_disaster_tips: disaster.afterTips,
          supply_list: disaster.supplyList,
          evacuation_info: disaster.evacuationInfo,
          warning_signs: disaster.warningSigns,
          icon_name: disaster.icon,
          color_scheme: disaster.color
        }, { 
          onConflict: 'type',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error seeding disaster ${disaster.type}:`, error);
      } else {
        console.log(`✅ Seeded disaster: ${disaster.title}`);
      }
    }

    // 2. Seed tasks table
    console.log('📝 Seeding tasks...');
    for (const task of mockTasks) {
      const { error } = await supabase
        .from('tasks')
        .upsert({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          points: task.points,
          steps: task.instructions, // Map instructions to steps
          disaster_types: [], // Empty array for now
          is_active: true
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error seeding task ${task.title}:`, error);
      } else {
        console.log(`✅ Seeded task: ${task.title}`);
      }
    }

    // 3. Seed resources table
    console.log('📚 Seeding resources...');
    for (const resource of mockResources) {
      const { error } = await supabase
        .from('resources')
        .upsert({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.type,
          content_url: resource.contentUrl,
          thumbnail_url: resource.thumbnailUrl,
          category: resource.category,
          duration_minutes: resource.duration,
          difficulty_level: resource.difficulty,
          tags: resource.tags,
          is_featured: resource.isFeatured
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error seeding resource ${resource.title}:`, error);
      } else {
        console.log(`✅ Seeded resource: ${resource.title}`);
      }
    }

    // 4. Seed alerts table
    console.log('🚨 Seeding alerts...');
    for (const alert of mockAlerts) {
      const { error } = await supabase
        .from('alerts')
        .upsert({
          id: alert.id,
          type: alert.type,
          title: alert.title,
          description: alert.description,
          level: alert.level,
          location: alert.location,
          source: alert.source,
          instructions: alert.instructions,
          is_active: alert.isActive,
          created_at: alert.timestamp
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error seeding alert ${alert.title}:`, error);
      } else {
        console.log(`✅ Seeded alert: ${alert.title}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
