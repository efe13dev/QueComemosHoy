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

export const saveRecipe = async (recipe) => {
  try {
    const { error } = await supabase
      .from('recipes')
      .insert([
        {
          name: recipe.name,
          category: recipe.category,
          time: recipe.time,
          image: recipe.image,
          people: recipe.people,
          ingredients: recipe.ingredients,
          preparation: recipe.preparation
        }
      ])
      .select();
    if (error) {
      console.error('Error adding recipe', error.message);
    }
  } catch (error) {
    console.error('Error adding recipe', error.message);
  }
};

export const deleteRecipe = async (id) => {
  try {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.error('Error delete recipe:', error.message);
    }
  } catch (error) {
    console.error('Error delete recipe:', error.message);
  }
};

export const updateRecipe = async (id, updatedRecipe) => {
  try {
    const { error } = await supabase
      .from('recipes')
      .update({
        name: updatedRecipe.name,
        category: updatedRecipe.category,
        time: updatedRecipe.time,
        image: updatedRecipe.image,
        people: updatedRecipe.people,
        ingredients: updatedRecipe.ingredients,
        preparation: updatedRecipe.preparation
      })
      .eq('id', id);
    if (error) {
      console.error('Error updating recipe:', error.message);
    }
  } catch (error) {
    console.error('Error updating recipe:', error.message);
  }
};
