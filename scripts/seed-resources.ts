import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { resources } from '../mocks/resources';

// Load environment variables for Node.js execution
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vczquvzjwzdclcmdhuqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjenF1dnpqd3pkY2xjbWRodXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODU1NTksImV4cCI6MjA3MDY2MTU1OX0.dmKEvfcXcUgW1HzMDMe_2LCpInO0fjQ8Db42PUDCf_Y';

// Create Supabase client for seeding (Node.js environment)
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Seed the resources table with data from the mock file
 * This script converts the mock data format to match the Supabase schema
 */
export async function seedResources() {
  console.log('🌱 Starting resources seeding...');
  
  try {
    // Convert mock resources to Supabase format (let Supabase generate UUIDs)
    const resourcesToInsert = resources.map(resource => ({
      // Don't include id, let Supabase generate UUID
      title: resource.title,
      description: resource.description,
      category: resource.category,
      contact_phone: resource.contactPhone || null,
      contact_email: resource.contactEmail || null,
      website: resource.website || null,
      address: resource.address || null,
      coordinates: resource.coordinates || null,
      disaster_types: resource.disasterTypes,
    }));

    console.log(`📊 Preparing to insert ${resourcesToInsert.length} resources...`);

    // Insert resources into Supabase
    const { data, error } = await supabase
      .from('resources')
      .insert(resourcesToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting resources:', error);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} resources!`);
    
    // Log inserted resources for verification
    data?.forEach((resource) => {
      console.log(`   - ${resource.title} (${resource.category})`);
    });

    return data;
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all resources from the table
 * Use with caution - this will delete all resource data
 */
export async function clearResources() {
  console.log('🧹 Clearing all resources...');
  
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error('❌ Error clearing resources:', error);
      throw error;
    }

    console.log('✅ All resources cleared successfully!');
  } catch (error) {
    console.error('❌ Clearing failed:', error);
    throw error;
  }
}

// Export for direct execution
export default seedResources;

// If running this file directly, execute the seeding
if (require.main === module) {
  seedResources()
    .then(() => {
      console.log('🎉 Resources seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
