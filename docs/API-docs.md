# API docs

_Last updated: Aug 15, 2024_

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

> Status: TODO ⚙️ - waiting for participant structure

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

> Status: TODO ⚙️ - waiting for participant structure

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

> Status: DONE ✅

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

> Status: DONE ✅

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

> Status: DONE ✅

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
        index: 6, // not yet implemented
        timestamp: 1720656000,
        avgNutriScore: "A",
        avgFsaScore: 3,
        numNonMatchedProducts: 2,
        products: [
            {
                productId: 1, // not yet implemented
                name: "Bio Vollkornbrot 350g",
                quantity: 10,
                nutrients: {
                    nutriScore: "A",
                    fsaScore: 3,
                    kcal: 250,
                    proteins: 8,
                    fats: 2,
                    saturatedFats: 1,
                    carbohydrates: 60,
                    sugar: 40,
                    fibers: 5,
                    salt: 1,
                    sodium: 1,
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

## POST /dietcoach/backend/dietician/session

> Status: DONE ✅

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
```

### Response

```
{
    sessionId: 123,
}
```

## POST /dietcoach/backend/dietician/recommendation

> Status: DONE ✅

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
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

> Status: DONE ✅

> Priority: HIGH

> Reuse: -

### Headers

```
Authentication: string
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

> Status: DONE ✅

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

## POST /dietcoach/backend/dietician/session-note

> Status: DONE ✅

> Priority: MEDIUM

> Reuse: -

### Headers

```
Authentication: string
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

## PUT /dietcoach/backend/dietician/recommendation

> Status: DONE ✅

> Priority: LOW

> Reuse: -

### Headers

```
Authentication: string
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

## GET /dietcoach/backend/dietician/table

> Status: TODO ⚙️

> Priority: HIGH

> Reuse: /nutrient-table

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

### Response Types

```
category: string[]
quantity: number,
energyShare: number,
energyKJ: number,
sugar: number,
saturatedFat: number,
sodium: number,
fVPN: number,
dietaryFiber: number,
protein: number,
```

### Response Exanple

```
[
    {
        category: ["Getränke"],
        quantity: 120,
        energyShare: 100,
        energyKJ: 400,
        sugar: 20,
        saturatedFat: 0,
        sodium: 0,
        fVPN: 5,
        dietaryFiber: 2,
        protein: 0,
    },
    {
        category: ["Getränke", "Saft"],
        quantity: 80
        energyShare: 60,
        energyKJ: 240,
        sugar: 15,
        saturatedFat: 0,
        sodium: 0,
        fVPN: 2,
        dietaryFiber: 1,
        protein: 0,
    },
    {
        category: ["Getränke", "Milchgetränke"],
        quantity: 40,
        energyShare: 40,
        energyKJ: 160,
        sugar: 5,
        saturatedFat: 0,
        sodium: 0,
        fVPN: 3,
        dietaryFiber: 1,
        protein: 0,
    },
    {
        category: ["Getränke", "Süssgetränke"],
        quantity: 0,
        energyShare: 7,
        energyKJ: 0,
        sugar: 0,
        saturatedFat: 0,
        sodium: 0,
        fVPN: 0,
        dietaryFiber: 0,
        protein: 0,
    },
    {
        category: ["Getränke", "Wasser, Kaffee & Tee"],
        quantity: 0,
        energyShare: 7,
        energyKJ: 0,
        sugar: 0,
        saturatedFat: 0,
        sodium: 0,
        fVPN: 0,
        dietaryFiber: 0,
        protein: 0,
    },
    ...
];
```

## GET nutristorage.ch/products/product-by-id/:id OR GET nutristorage.ch/products/:gtin

> Status: DONE ✅

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
        nutriScore: "A",
        fsaScore: 3,
        kcal: 250,
        proteins: 8,
        fats: 2,
        saturatedFats: 1,
        carbohydrates: 60,
        sugar: 40,
        fibers: 5,
        salt: 1,
        sodium: 1,
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

## GET nutristorage.ch/products/

> Status: DONE ✅

> Priority: HIGH

> Reuse:

> Comment: DB API endpoint (different URL)

### Query params

```
page: number (optional, default: 1)
limit: number (optional, default: 100)
search: string (optional, for filtering products by name)
dietcoach-category-l1: string (optional, for filtering products by major category)
dietcoach-category-l2: string (optional, for filtering products by minor category)
nutriscore-cutoff: string (optional, default: "C", includes C)
```

### Response (Example)

```
{
  products: [
    {
      productId: 1,
      de: {
       name: "Bio Vollkornbrot 350g",
      },
      productSize: 10,
      nutrients: {
        kcal: 250,
        proteins: 8,
        fats: 2,
        saturatedFats: 1,
        carbohydrates: 60,
        sugar: 40,
        fibers: 5,
        salt: 1,
        sodium: 1,
      },
      nutriScoreV2023Detail: {
        nutriScoreCalculated: "C",
        nsPoints: 10,
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
