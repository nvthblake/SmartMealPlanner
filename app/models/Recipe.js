class Recipe {
    constructor(id, image, imageType, likes, missedIngredientCount, missedIngredients, title, unusedIngredients, usedIngredientCount, usedIngredients) {
        this.id = id;
        this.image = image;
        this.imageType = imageType;
        this.likes = likes;
        this.missedIngredientCount = missedIngredientCount;
        this.missedIngredients = missedIngredients;
        this.title = title;
        this.unusedIngredients = unusedIngredients;
        this.usedIngredientCount = usedIngredientCount;
        this.usedIngredients = usedIngredients;

        // Assigned later
        this.vegetarian = false;
        this.vegan = false;
        this.glutenFree = false;
        this.dairyFree = false;
        this.veryHealthy = false;
        this.cheap = false;
        this.veryPopular = false;
        this.sustainable = false;
        this.weightWatcherSmartPoints = 0;
        this.gaps = 'no';
        this.lowFodmap = false;
        this.ketogenic = false;
        this.whole30 = false;
        this.servings = 0;
        this.sourceUrl = '';
        this.spoonacularSourceUrl = '';
        this.aggregateLikes = 0;
        this.spoonacularScore = 0;
        this.healthScore = 0;
        this.creditText = '';
        this.sourceName = '';
        this.pricePerServing = '';
        this.readyInMinutes = false;
        this.cuisines = [];
        this.dishTypes = [];
        this.instructions = ''
    }
}

export default Recipe;