package com.example.smartfridge;

public class ShoppingListItem implements Comparable {
    public String itemName;
    public Boolean isChecked;

    public ShoppingListItem(String itemName, Boolean isChecked) {
        this.itemName = itemName;
        this.isChecked = isChecked;
    }


    @Override
    public int compareTo(Object o) {
//        if (isChecked) return -99;
        int str1_ch = (int)itemName.charAt(0);
        int str2_ch = (int)((ShoppingListItem)o).itemName.charAt(0);

        return str1_ch - str2_ch;
    }
}
