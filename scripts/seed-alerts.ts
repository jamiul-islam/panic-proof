import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { alerts } from '../mocks/alerts';

// Load environment variables for Node.js execution
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vczquvzjwzdclcmdhuqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjenF1dnpqd3pkY2xjbWRodXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODU1NTksImV4cCI6MjA3MDY2MTU1OX0.dmKEvfcXcUgW1HzMDMe_2LCpInO0fjQ8Db42PUDCf_Y';

// Create Supabase client for seeding (Node.js environment)
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Seed the alerts table with data from the mock file
 * This script converts the mock data format to match the Supabase schema
 */
export async function seedAlerts() {
  console.log('🌱 Starting alerts seeding...');
  
  try {
    // Convert mock alerts to Supabase format (let Supabase generate UUIDs)
    const alertsToInsert = alerts.map(alert => ({
      // Don't include id, let Supabase generate UUID
      type: alert.type,
      title: alert.title,
      description: alert.description,
      level: alert.level,
      location: alert.location,
      date: alert.date,
      is_active: alert.isActive,
      source: alert.source,
      instructions: alert.instructions || null,
    }));

    console.log(`📊 Preparing to insert ${alertsToInsert.length} alerts...`);

    // Insert alerts into Supabase
    const { data, error } = await supabase
      .from('alerts')
      .insert(alertsToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting alerts:', error);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} alerts!`);
    
    // Log inserted alerts for verification
    data?.forEach((alert) => {
      console.log(`   - ${alert.title} (${alert.type}, ${alert.level})`);
    });

    return data;
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all alerts from the table
 * Use with caution - this will delete all alert data
 */
export async function clearAlerts() {
  console.log('🧹 Clearing all alerts...');
  
  try {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error('❌ Error clearing alerts:', error);
      throw error;
    }

    console.log('✅ All alerts cleared successfully!');
  } catch (error) {
    console.error('❌ Clearing failed:', error);
    throw error;
  }
}

// Export for direct execution
export default seedAlerts;

// If running this file directly, execute the seeding
if (require.main === module) {
  seedAlerts()
    .then(() => {
      console.log('🎉 Alerts seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
