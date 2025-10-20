import Constants from 'expo-constants';

const extra = (Constants.expoConfig || Constants.manifest)?.extra || {};

export const SUPABASE_URL: string = extra.SUPABASE_URL;
export const SUPABASE_ANON_KEY: string = extra.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Defina SUPABASE_URL e SUPABASE_ANON_KEY em app.json > extra');
}
