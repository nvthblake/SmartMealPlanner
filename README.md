# SmartFridge

# Inspiration
In the United States, food waste is estimated at between 30-40% of the food supply (figure from the FDA). Our biggest inspiration stems from our concern about the environment and how we can make simple lifestyle changes be more responsible about our consumption. SmartFridge app is a solution that makes meal-planning convenient, intuitive and sustainable. We create a logistic app that lets users monitor their food resources with ease. By scanning users' food inventory at home via picture input, the app will classify its users' food into categories, come up with suggested cooking recipes depending on the available food, prioritize food that will go bad soon, and send out alerts once the user's fridge is running low or going to expire. With the aforementioned features, SmartFridge app is the all-in-one solution for people to keep track of their fridge, have a more diverse meal plan, and reduce personal food waste.

# Demo Prototype
[![Demo Video](img/thumbnail.png)](https://youtu.be/j6zuf78dDC0)

# What it does
SmartFridge has 5 main tabs, which are "Ingredient", "Meal Planning", "Scan", "Shopping List", and "Profile" tabs. SmartFridge lets its users scan in the food, then store it in the "Ingredient" tab so that user can easily monitor what food is available in their home kitchen. In the "Meal Planning" tab, user will be provided with plenty of suggested cooking recipes depending on the available food. After cooking, the app will track what recipe the user created on a day and remove items for user inventory. Users can also mark a favorite recipe from the "Meal Planning" tab that they do not have all the required ingredients, and the missing ingredients will be automatically created in the "Shopping List" tab to remind the users to shop for those missing ingredients. The "Shopping List" tab is also integrated with Google Map API to notify user with closed-by grocery stores. The "Profile" tab is to keep all personal information of the users such as how full the user's fridge is, how many item is going to expire soon, etc.

# How we built it
We built an Android App from scratch using Android Studio. We also used spoonacular API to suggest user with cooking recipes and Google Map API to locate nearby stores. The back-end of the app is ran on SQLite. Its main function is to record the food resources of the users and interact between different components of user interaction.

# Challenges we ran into
We had a hard time figuring out how to connect our app to the APIs for it to be functional. On the front-end side, we also had to spent a lot of time polishing the UI/UX of the app.

# Accomplishments that we are proud of
We are able to build a completely functioning app within 36 hours. Also, we believe that this app is going to impact a lot of people lifestyle and help reduce food waste.

# What we learned
Android Studio, Spoonacular API, Google Map API, SQLite.

# What's next for SmartFridge - reduce food waste
Hopefully we can scale this product and make it available to everyone since we see a crucial role that this product plays in our day-to-day life. We also want to complete the image-recognition function of the app to reduce user input effort and make the app more and more convenient.
