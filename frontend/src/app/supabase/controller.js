// lib/articlesController.js
import { supabase } from './client';

/**
 * Fetch latest articles
 * @param {number} limit - number of articles to fetch
 * @returns {Array} articles
 */
export async function getLatestArticles(limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }

  return data;
}
/**
 * Fetch all unique article categories
 * @returns {Array} categories
 */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('articles')
    .select('category', { distinct: true })
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Extract just the category names as an array
  return data.map(item => item.category);
}

/**
 * Fetch articles by category
 * @param {string} category - category name
 * @param {number} limit - number of articles to fetch
 * @returns {Array} articles
 */
export async function getArticlesByCategory(category, limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }

  return data;
}

/**
 * Fetch single article by slug
 * @param {string} slug - article slug
 * @returns {Object} article
 */
export async function getArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }

  return data;
}

/**
 * Search articles by keyword in title, subtitle, or tags
 * @param {string} keyword
 * @returns {Array} articles
 */
export async function searchArticles(keyword) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(
      `title.ilike.%${keyword}%,subtitle.ilike.%${keyword}%,tags.cs.{${keyword}}`
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching articles:', error);
    return [];
  }

  return data;
}

/**
 * Create a new article
 * @param {Object} articleData
 * @returns {Object} inserted article
 */
export async function createArticle(articleData) {
  const { data, error } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing article
 * @param {string} id - article id
 * @param {Object} articleData
 * @returns {Object} updated article
 */
export async function updateArticle(id, articleData) {
  const { data, error } = await supabase
    .from('articles')
    .update(articleData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    return null;
  }

  return data;
}

/**
 * Delete an article
 * @param {string} id - article id
 * @returns {boolean} success
 */
export async function deleteArticle(id) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    return false;
  }

  return true;
}

/**
 * Count total articles
 * @returns {number} total articles
 */
export async function countArticles() {
  const { count, error } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting articles:', error);
    return 0;
  }

  return count;
}
