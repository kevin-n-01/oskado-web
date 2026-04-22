

export const STATUS_COLORS: Record<string, string> = {
    "Inventoried": "bg-gray-500",
    "Unlisted": "bg-yellow-500",
    "Listed": "bg-blue-500",
    "Sold": "bg-green-500",
    "Shipped": "bg-purple-500",
    "Completed": "bg-emerald-500",
    "Returned": "bg-orange-500",
    "Discontinued": "bg-red-500",
};

export const CONDITION_LIST = ["Poor", "Fair", "Good", "Like New", "New With Tags"] as const;
export type ConditionList = (typeof CONDITION_LIST)[number];