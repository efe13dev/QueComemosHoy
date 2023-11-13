const recipesJson = require('../data/recipes.json');
export function getRecipesWeek() {
  const weekRecipes = recipesJson
    .sort(function () {
      return 0.5 - Math.random();
    })
    .slice(0, 7);

  const parsedRecipes = JSON.stringify(weekRecipes);
  return parsedRecipes;
}
