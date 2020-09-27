import requests
import pandas as pd
import json

# Initialize variables
headers = {
    'x-rapidapi-host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    'x-rapidapi-key': "895ce719e4mshcb836fa18684a5ap1c69f2jsnf7e37492c80d"
    }
popularIngredients = ['rice', 'oatmeal', 'pasta', 'chicken']#, 'apple', 'chickpea', 'chicken', 'tomato', 'pasta', 'cauliflower']
recipeIdArray = []
recipeDf = pd.DataFrame(columns=['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'veryHealthy',
       'cheap', 'veryPopular', 'sustainable', 'weightWatcherSmartPoints',
       'gaps', 'lowFodmap', 'aggregateLikes', 'spoonacularScore',
       'healthScore', 'creditsText', 'license', 'sourceName',
       'pricePerServing', 'extendedIngredients', 'id', 'title',
       'readyInMinutes', 'servings', 'sourceUrl', 'image', 'imageType',
       'summary', 'cuisines', 'dishTypes', 'diets', 'occasions',
       'instructions', 'analyzedInstructions', 'originalId',
       'spoonacularSourceUrl', 'winePairing.pairedWines',
       'winePairing.pairingText', 'winePairing.productMatches'])
ingredientRecipeDf = pd.DataFrame(columns=['recipeId','id', 'aisle', 'image', 'consistency', 'name', 'original',
                                           'originalString', 'originalName', 'amount', 'unit', 'meta',
                                           'metaInformation', 'measures', 'metric'])
dishTypeRecipeDf = pd.DataFrame(columns=['recipeId', 'dishType'])


# Get list of recipes to scrape
urlRecipeId = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients"

for i in popularIngredients:
    queryStringRecipeId = {"number":"20","ranking":"1","ignorePantry":"true","ingredients":i}
    responseRecipeId = requests.request("GET", urlRecipeId, headers=headers, params=queryStringRecipeId)
    jsonDataRecipeId = responseRecipeId.json()
    recipeIdDf = pd.json_normalize(jsonDataRecipeId)
    recipeIdArray = recipeIdArray + [dic['id'] for dic in jsonDataRecipeId]

recipeIdArray = list(dict.fromkeys(recipeIdArray))  # dedupe recipe IDs


# Get details for each recipe
for r in recipeIdArray:
    urlRecipeDetail = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + str(r) + "/information"
    responseRecipeDetail = requests.request("GET", urlRecipeDetail, headers=headers)
    jsonDataRecipeDetail = responseRecipeDetail.json()
    recipeDf = recipeDf.append(pd.json_normalize(jsonDataRecipeDetail))


# Parse ingredients for each recipe
for _, row in recipeDf.iterrows():
    for ingredientDict in row['extendedIngredients']:
        ingredientDict['recipeId'] = row['id']
        ingredientRecipeDf = ingredientRecipeDf.append(ingredientDict, ignore_index=True)


# Parse dish type for each recipe
for _, row in recipeDf.iterrows():
    for dishType in row['dishTypes']:
        dishTypeRecipeDf = dishTypeRecipeDf.append({'recipeId': row['id'], 'dishType': dishType}, ignore_index=True)


# Clean df recipeDf
recipeDfCleaned = recipeDf.loc[:,['id', 'title',
                                  'vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'veryHealthy',
                                  'cheap', 'veryPopular', 'sustainable', 'sourceName',
                                  'readyInMinutes', 'servings', 'sourceUrl']].drop_duplicates()

ingredientRecipeDfClean = ingredientRecipeDf.loc[:, ['recipeId', 'id', 'name', 'amount', 'unit']].rename(columns={'id':'ingredientId'})
ingredientDfClean = ingredientRecipeDf.loc[:, ['id', 'name', 'aisle', 'consistency']].drop_duplicates()
# Need to add step to re-categorize ingredients based on aisle and consistency


# Export to .csv
recipeDf.to_csv(r"SmartFridgeRecipe.csv", index=False)
recipeDfCleaned.to_csv(r"DimRecipe.csv", index=False)
ingredientRecipeDfClean.to_csv(r"FactRecipeIngredient.csv", index=False)
ingredientDfClean.to_csv(r"DimIngredient.csv", index=False)
dishTypeRecipeDf.to_csv(r"FactRecipeDishType.csv", index=False)

