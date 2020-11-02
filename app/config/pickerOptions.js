export default {
    inventoryFilter: [
        { id: 0, title: "All", select: true, },
        { id: 1, title: "Meat", select: false, },
        { id: 2, title: "Vegetable", select: false, },
        { id: 3, title: "Snack", select: false, },
        { id: 4, title: "Condiments", select: false, },
        { id: 5, title: "Fruit", select: false, },
        { id: 6, title: "Others", select: false, },
      ],
    categories: [
        { label: "Meat", value: 1, backgroundColor: "red", icon: "apps" },
        { label: "Vegetable", value: 2, backgroundColor: "green", icon: "email" },
        { label: "Condiments", value: 3, backgroundColor: "blue", icon: "lock" },
        { label: "Snack", value: 4, backgroundColor: "blue", icon: "lock" },
        { label: "Fruit", value: 5, backgroundColor: "blue", icon: "lock" },
        { label: "Others", value: 6, backgroundColor: "blue", icon: "lock" },
    ],
    units: [
        { label: "Quart", value: 1 },
        { label: "Kg", value: 2 },
        { label: "Cay", value: 3}
    ]
}