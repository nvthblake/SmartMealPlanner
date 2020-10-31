import { SPOONACULAR_SECRETS } from '../config/secret';

import SpoonacularIngredient from '../models/SpoonacularIngredient';
import Recipe from '../models/Recipe';

const BASE_URL = 'https://rapidapi.p.rapidapi.com';

function getRecipes(ingredients, limit) {
    return new Promise((resolve, reject) => {
        if (ingredients.length === 0) {
            resolve([]);
            return;
        }
        // %20 is for spaces, and %2C is for seperating differet ingredient
        const params = ingredients
            .map((ingredient) => ingredient.name.replace(" ", "%20"))
            .join("%2C");

        fetch(`${BASE_URL}/recipes/findByIngredients?ingredients=${params}&number=${limit}&ranking=1&ignorePantry=true`,
            {
                method: 'GET',
                headers: {
                    "x-rapidapi-host": SPOONACULAR_SECRETS["X-RapidAPI-Host"],
                    "x-rapidapi-key": SPOONACULAR_SECRETS["X-RapidAPI-Key"]
                }
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                const result = [];
                responseJson.forEach((recipeJson) => {
                    const missedIngredients = recipeJson.missedIngredients.map(
                        (missedIngredient) => {
                            const newMissedIng = new SpoonacularIngredient(
                                missedIngredient.aisle,
                                missedIngredient.amount,
                                missedIngredient.id,
                                missedIngredient.image,
                                missedIngredient.meta,
                                missedIngredient.metaInformation,
                                missedIngredient.name,
                                missedIngredient.original,
                                missedIngredient.originalName,
                                missedIngredient.originalString,
                                missedIngredient.unit,
                                missedIngredient.unitLong,
                                missedIngredient.unitShort
                            );
                            return newMissedIng;
                        }
                    );
                    const unusedIngredients = recipeJson.unusedIngredients.map(
                        (unusedIngredient) => {
                            const newUnusedIng = new SpoonacularIngredient(
                                unusedIngredient.aisle,
                                unusedIngredient.amount,
                                unusedIngredient.id,
                                unusedIngredient.image,
                                unusedIngredient.meta,
                                unusedIngredient.metaInformation,
                                unusedIngredient.name,
                                unusedIngredient.original,
                                unusedIngredient.originalName,
                                unusedIngredient.originalString,
                                unusedIngredient.unit,
                                unusedIngredient.unitLong,
                                unusedIngredient.unitShort
                            );
                            return newUnusedIng;
                        }
                    );
                    const usedIngredients = recipeJson.usedIngredients.map(
                        (usedIngredient) => {
                            const newUsedIng = new SpoonacularIngredient(
                                usedIngredient.aisle,
                                usedIngredient.amount,
                                usedIngredient.id,
                                usedIngredient.image,
                                usedIngredient.meta,
                                usedIngredient.metaInformation,
                                usedIngredient.name,
                                usedIngredient.original,
                                usedIngredient.originalName,
                                usedIngredient.originalString,
                                usedIngredient.unit,
                                usedIngredient.unitLong,
                                usedIngredient.unitShort
                            );
                            return newUsedIng;
                        }
                    );
                    const newRecipe = new Recipe(
                        recipeJson.id,
                        recipeJson.image,
                        recipeJson.imageType,
                        recipeJson.likes,
                        recipeJson.missedIngredientCount,
                        missedIngredients,
                        recipeJson.title,
                        unusedIngredients,
                        recipeJson.usedIngredientCount,
                        usedIngredients
                    );
                    result.push(newRecipe);
                });
                resolve(result);
            })
            .catch((err) => {
                // console.log("RecipeTab -> componentDidMount -> err", err);
                reject(err);
                alert("Out of Spoonacular usage lol!");
            });
    });
}

function getRecipeInfoInBulk(recipes) {
    return new Promise((resolve, reject) => {
        const recipeIds = recipes.map((recipe) => recipe.id);
        fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${recipeIds.join(',')}`,
            {
                method: 'GET',
                headers: {
                    "x-rapidapi-host": SPOONACULAR_SECRETS["X-RapidAPI-Host"],
                    "x-rapidapi-key": SPOONACULAR_SECRETS["X-RapidAPI-Key"]
                }
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson.forEach((recipeJson) => {
                    recipes.forEach((recipe) => {
                        if (recipe.id === recipeJson.id) {
                            recipe.vegetarian = recipeJson.vegetarian;
                            recipe.vegan = recipeJson.vegan;
                            recipe.glutenFree = recipeJson.glutenFree;
                            recipe.dairyFree = recipeJson.dairyFree;
                            recipe.veryHealthy = recipeJson.veryHealthy;
                            recipe.cheap = recipeJson.cheap;
                            recipe.veryPopular = recipeJson.veryPopular;
                            recipe.sustainable = recipeJson.sustainable;
                            recipe.weightWatcherSmartPoints = recipeJson.weightWatcherSmartPoints;
                            recipe.gaps = recipeJson.gaps;
                            recipe.lowFodmap = recipeJson.lowFodmap;
                            recipe.ketogenic = recipeJson.ketogenic;
                            recipe.whole30 = recipeJson.whole30;
                            recipe.servings = recipeJson.servings;
                            recipe.sourceUrl = recipeJson.sourceUrl;
                            recipe.spoonacularSourceUrl = recipeJson.spoonacularSourceUrl;
                            recipe.aggregateLikes = recipeJson.aggregateLikes;
                            recipe.spoonacularScore = recipeJson.spoonacularScore;
                            recipe.healthScore = recipeJson.healthScore;
                            recipe.creditText = recipeJson.creditText;
                            recipe.sourceName = recipeJson.sourceName;
                            recipe.pricePerServing = recipeJson.pricePerServing;
                            recipe.readyInMinutes = recipeJson.readyInMinutes;
                            recipe.cuisines = recipeJson.cuisines ? recipeJson.cuisines : [];
                            recipe.dishTypes = recipeJson.dishTypes ? recipeJson.dishTypes : [];
                            recipe.instructions = recipeJson.instructions;
                            return;
                        }
                    });
                });
                resolve(recipes);
            })
            .catch((err) => {
                // console.log("RecipeTab -> componentDidMount -> err", err);
                reject(err);
                alert("Out of Spoonacular usage lol!");
            });
    });
}

module.exports = { getRecipes, getRecipeInfoInBulk }