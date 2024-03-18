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

export const getRecipe = async (id) => {
  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id);
    if (error) {
      console.error('Error fetching recipe:', error.message);
    }
    if (recipe && recipe.length > 0) {
      return recipe;
    }
  } catch (error) {
    console.error('Error fetching recipe', error.message);
  }
};
