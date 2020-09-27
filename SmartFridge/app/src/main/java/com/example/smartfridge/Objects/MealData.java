package com.example.smartfridge.Objects;

public class MealData {
    private String mealName;
    private String mealDescription;
    private int mealImage;

    public MealData(String mealName, String mealDescription, int mealImage) {
        this.mealName = mealName;
        this.mealDescription = mealDescription;
        this.mealImage = mealImage;
    }

    // Getter Methods
    public String getMealName() {
        return this.mealName;
    }

    public String getMealDescription() {
        return this.mealDescription;
    }

    public int getMealImage() {
        return this.mealImage;
    }

    // Setter Methods
    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    public void setMealDescription(String mealDescription) {
        this.mealDescription = mealDescription;
    }

    public void setMealImage(int mealImage) {
        this.mealImage = mealImage;
    }
}
