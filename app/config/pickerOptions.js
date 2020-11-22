export default {
    inventoryFilter: [
        { id: 0, title: "All", select: true, },
        { id: 1, title: "Meat", select: false, },
        { id: 2, title: "Vegetable", select: false, },
        { id: 3, title: "Snack", select: false, },
        { id: 4, title: "Condiments", select: false, },
        { id: 5, title: "Fruit", select: false, },
        { id: 6, title: "Beverages", select: false, },
        { id: 7, title: "Others", select: false, },
      ],
    categories: [
        { label: "Meat", value: 1, backgroundColor: "red", icon: "apps" },
        { label: "Vegetable", value: 2, backgroundColor: "green", icon: "email" },
        { label: "Condiments", value: 3, backgroundColor: "blue", icon: "lock" },
        { label: "Snack", value: 4, backgroundColor: "blue", icon: "lock" },
        { label: "Fruit", value: 5, backgroundColor: "blue", icon: "lock" },
        { label: "Beverages", value: 6, backgroundColor: "blue", icon: "lock" },
        { label: "Others", value: 7, backgroundColor: "blue", icon: "lock" },
    ],
    units: [
        { label: "lbs", value: 1 },
        { label: "oz", value: 2 },
        { label: "kg", value: 3 },
        { label: "ml", value: 4 },
        { label: "unit", value: 7}
    ],
    mealtype: [
        { label: "breakfast", value: 1 },
        { label: "lunch", value: 2 },
        { label: "dinner", value: 3 },
    ]
}