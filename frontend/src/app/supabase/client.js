import { createClient } from '@supabase/supabase-js';
 const supabaseUrl = "https://nahxvaunlwswlxxicbrv.supabase.co"; 
 const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHh2YXVubHdzd2x4eGljYnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzMzMzMsImV4cCI6MjA3NjgwOTMzM30.LXUD-lm32MUxOwTztcRmhxWhRcPlsjEu2Yl7C2hVOlU"; 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);