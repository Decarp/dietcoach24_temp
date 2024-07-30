# API docs

_Last updated: Jul 28, 2024_

## POST /dietcoach/backend/dietician/register

> Status: DONE ✅

### Body

```
{
    email: string,
    password: string,
    firstName: string,
    lastName: string
}
```

## POST /dietcoach/backend/dietician/login

> Status: DONE ✅

### Body

```
{
    email: string,
    password: string,
}
```

## GET /dietcoach/backend/dietician/participants

> Status: TODO ⚙️

> Priority: LOW

> Reuse: "/users"

### Headers

```
Authentication: string
```

### Response (Example)

```
[
    {
        participantId: 1,
        firstName: "Mia",
        lastName: "Wallace",
        ...
    },
    ...
]
```

## GET /dietcoach/backend/dietician/participant-details

> Status: TODO ⚙️

> Priority: LOW

> Reuse: "/user-survey"

### Headers

```
Authentication: string
Participant-Id: string
```

### Response (Example)

```
{
    participantId: 1,
    firstName: "Mia",
    lastNama: "Wallace",
    ...
}
```

## GET /dietcoach/backend/dietician/profile

> Status: TODO ⚙️

> Priority: LOW

> Reuse: "/profile"

### Headers

```
Authentication: string
```

### Response (Example)

```
{
    email: "mia.wallace@mail.com",
    firstName: "Mia",
    lastName: "Wallace",
}
```

## GET /dietcoach/backend/dietician/baskets

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
Start-Timestamp: number
End-Timestamp: number (EoD)
```

### Response (Example)

```
[
    {
        basketId: "basketId1",
        index: 4,
        timestamp: 1716336000,
        numProducts: 8,
        avgNutriScore: "D",
        avgFsaScore: 9,
    },
    {
        basketId: "basketId2",
        index: 5,
        timestamp: 1719532800,
        numProducts: 12,
        avgNutriScore: "D",
        avgFsaScore: 8,
    },
    {
        basketId: "basketId3",
        index: 6,
        timestamp: 1720656000,
        numProducts: 3,
        avgNutriScore: "A",
        avgFsaScore: 3,
    },
    ...
]
```

## POST /dietcoach/backend/dietician/basket-products

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: "/shopping-history"

### Headers

```
Authentication: string
Participant-Id: string
```

### Body

```
{
    basketIds: [
        "basketId1",
        "basketId2",
        "basketId3"
    ]
}
```

### Response (Example)

```
[
    {
        basketId: "basketId3",
        index: 6,
        timestamp: 1720656000,
        avgNutriScore: "A",
        avgFsaScore: 3,
        products: [
            {
                productId: 1,
                name: "Bio Vollkornbrot 350g",
                quantity: 10,
                nutrients: {
                    nutriScore: 2,
                    kcal: 250,
                    proteins: 8,
                    fats: 2,
                    carbohydrates: 60,
                    fibers: 5,
                    salt: 1,
                }
                dietCoachCategoryL1: {
                    de: "Getreideprodukte & Kartoffeln",
                    en: "Grain products & potatoes"
                },
                dietCoachCategoryL2: {
                    de: "Brot",
                    en: "Bread"
                },
                imageUrl: "https://www.image.com/image.jpg"
            },
            ...
        ]
    },
    ...
]
```

## POST /dietcoach/backend/dietician/recommendation

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
Session-Id: string
```

### Body

```
{
    rule: {
        variant: "VAR1" | "VAR2" | "FREITEXT"
        mode: "" | null,
        nutrient: "" | null,
        category: "" | null,
        text: "" | null,
    }
    basketIds: [
        "basketId1",
        "basketId2",
        "basketId3",
    ],
    suggestions: {
        current: [
            productId1,
            productId2,
            productId3,
        ],
        alternatives: [
            productId1,
            productId2,
        ]
    },
    notes: "" | null,
}
```

## GET /dietcoach/backend/dietician/session

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
Session-Id: number
```

### Response

```
{
    sessionId: 123,
    index: 1,
    timestamp: 1716336000,
    recommendations: [
        {
            recommendationId: 123,
            index: 1,
            rule: {
                variant: "VAR1" | "VAR2" | "FREITEXT"
                mode: "" | null,
                nutrient: "" | null,
                category: "" | null,
                text: "" | null,
            }
            basketIds: [
                "basketId1",
                "basketId2",
                "basketId3"
            ],
            suggestions: {
                current: [
                    productId1,
                    productId2,
                    productId3,
                ],
                alternatives: [
                    productId1,
                    productId2,
                ]
            },
            notes: "" | null,
        },
        ...
    ]
    notes: {
        patient: "" | null,
        personal: "" | null
    }
}
```

## GET /dietcoach/backend/dietician/sessions

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
```

### Response

```
[
    {
        sessionId: 123,
        index: 1,
        timestamp: 1716336000,
    },
    ...
]
```

## POST /dietcoach/backend/dietician/note

> Status: TODO ⚙️

> Priority: MEDIUM

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
Session-Id: number
```

### Body

```
{
    notes: {
        patient: "",
        personal: ""
    }
}
```

## UPDATE /dietcoach/backend/dietician/recommendation

> Status: TODO ⚙️

> Priority: LOW

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
Session-Id: number
Recommendation-Id: number
```

### Body

```
{
    rule: {
        variant: "VAR1" | "VAR2" | "FREITEXT"
        mode: "" | null,
        nutrient: "" | null,
        category: "" | null,
        text: "" | null,
    }
    basketIds: [
        "basketId1",
        "basketId2",
        "basketId3",
    ],
    suggestions: {
        current: [
            productId1,
            productId2,
            productId3,
        ],
        alternatives: [
            productId1,
            productId2,
        ]
    },
    notes: "" | null
}
```

## GET /dietcoach/backend/dietician/product

> Status: TODO ⚙️

> Priority: HIGH

> Reuse:

> Comment: DB API endpoint (different URL)

### Header

```
Product-Id: number
```

### Response (Example)

```
{
    productId: 1,
    name: "Bio Vollkornbrot 350g",
    quantity: 10,
    nutrients: {
        nutriScore: 2,
        kcal: 250,
        proteins: 8,
        fats: 2,
        carbohydrates: 60,
        fibers: 5,
        salt: 1,
    }
    dietCoachCategoryL1: {
        de: "Getreideprodukte & Kartoffeln",
        en: "Grain products & potatoes"
    },
    dietCoachCategoryL2: {
        de: "Brot",
        en: "Bread"
    },
    imageUrl: "https://www.image.com/image.jpg"
}
```

## GET /dietcoach/backend/dietician/products

> Status: TODO ⚙️

> Priority: HIGH

> Reuse:

> Comment: DB API endpoint (different URL)

### Headers

```
Page: number (optional, default: 1)
Limit: number (optional, default: 100)
Search: string (optional, for filtering products by name)
DietCoach-Category-L1: string (optional, for filtering products by major category)
DietCoach-Category-L2: string (optional, for filtering products by minor category)
NutriScore-Cutoff: string (optional, default: "C", includes C)
```

### Response (Example)

```
{
    products: [
        {
            productId: 1,
            name: "Bio Vollkornbrot 350g",
            quantity: 10,
            nutrients: {
                nutriScore: 2,
                kcal: 250,
                proteins: 8,
                fats: 2,
                carbohydrates: 60,
                fibers: 5,
                salt: 1,
            }
            dietCoachCategoryL1: {
                de: "Getreideprodukte & Kartoffeln",
                en: "Grain products & potatoes"
            },
            dietCoachCategoryL2: {
                de: "Brot",
                en: "Bread"
            },
            imageUrl: "https://www.image.com/image.jpg"
        },
        ...
    ],
    meta: {
        totalPages: 20, // à 100 products
        totalProducts: 500
    }
}
```
