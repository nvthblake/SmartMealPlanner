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
    }
}

export default Recipe;