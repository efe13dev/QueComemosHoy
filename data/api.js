import { supabase } from '../utils/supabase';

export const getRecipes = async () => {
  try {
    const { data: recipes, error } = await supabase.from('recipes').select();
    if (error) {
      console.error('Error fetching recipes:', error.message);
    }
    if (recipes && recipes.length > 0) {
      return recipes;
    }
  } catch (error) {
    console.error('Error fetching recipes', error.message);
  }
};
