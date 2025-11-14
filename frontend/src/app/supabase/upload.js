import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// --- 1. Supabase credentials ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nahxvaunlwswlxxicbrv.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHh2YXVubHdzd2x4eGljYnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzMzMzMsImV4cCI6MjA3NjgwOTMzM30.LXUD-lm32MUxOwTztcRmhxWhRcPlsjEu2Yl7C2hVOlU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. Load JSON file ---
const raw = JSON.parse(fs.readFileSync('./src/app/supabase/article.json', 'utf8'));
const articles = raw.articles || raw;

console.log(`🟢 Loaded ${articles.length} articles`);

// --- 3. Upload logic ---
async function uploadData() {
  for (const article of articles) {
    try {
      console.log(`➡️ Processing: ${article.slug}`);

      const { data: existing, error: selectError } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .maybeSingle();

      if (selectError) {
        console.error(`❌ Failed to check existing for ${article.slug}:`, selectError.message);
        continue;
      }

      if (existing) {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update(article)
          .eq('slug', article.slug);

        if (updateError) {
          console.error(`⚠️ Update failed for ${article.slug}:`, updateError.message);
        } else {
          console.log(`🔁 Updated existing article: ${article.slug}`);
        }
      } else {
        // Insert new article
        const { error: insertError } = await supabase.from('articles').insert(article);

        if (insertError) {
          console.error(`❌ Insert failed for ${article.slug}:`, insertError.message);
        } else {
          console.log(`✅ Inserted new article: ${article.slug}`);
        }
      }
    } catch (err) {
      console.error(`💥 Unexpected error for ${article.slug}:`, err);
    }
  }

  console.log('🎯 Upload completed');
}

uploadData();
