# API docs

_Last updated: Jul 21, 2024_

## /dietcoach/backend/dietician/register

> Status: DONE ✅

### Body

```
{
  "email": string,
  "password": string,
  "firstName": string,
  "lastName": string
}
```

## /dietcoach/backend/dietician/login

> Status: DONE ✅

### Body

```
{
  "email": string,
  "password": string,
}
```

## /dietcoach/backend/dietitian/participants

> Status: TODO ⚙️

> Priority: 4

> Reuse: "/users"

### Headers

```
Authentication: string
```

### Response (Example)

```
[
    {
        "participantId": "1",
        "firstName": "Mia",
        "lastName": "Wallace",
        ...
    },
]
```

## /dietcoach/backend/dietician/participant-details

> Status: TODO ⚙️

> Priority: 5

> Reuse: "/user-survey"

### Headers

```
Authentication: string
Participant-Id: string
```

### Response (Example)

```
{
    "participantId": "1",
    "firstName": "Mia",
    "lastName": "Wallace",
    ...
}
```

## /dietcoach/backend/dietician/profile

> Status: TODO ⚙️

> Priority: 6

> Reuse: "/profile"

### Headers

```
Authentication: string
```

### Response (Example)

```
{
    "email": "mia.wallace@mail.com",
    "firstName": "Mia",
    "lastName": "Wallace",
}
```

## /dietcoach/backend/dietician/baskets

> Status: TODO ⚙️

> Priority: 1

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
        "basketId": 1,
        "index": 4,
        "timestamp": 1716336000,
        "numProducts": 1,
        "avgNutriscore": 2,
    },
    {
        "basketId": 2,
        "index": 5,
        "timestamp": 1719532800,
        "numProducts": 1,
        "avgNutriscore": 4,
    },
    {
        "basketId": 3,
        "index": 6,
        "timestamp": 1720656000,
        "numProducts": 1,
        "avgNutriscore": 2,
    },
    {
        "basketId": 4,
        "index": 7,
        "timestamp": 1721174400,
        "numProducts": 2,
        "avgNutriscore": 3,
    },
]
```

## /dietcoach/backend/dietician/chart/macro

> Status: TODO ⚙️

> Priority: 2

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
```

### Body

```
[basketId1, basketId2, basketId3]: number[]
```

### Response (Example)

```
[
    {
        "name": {
            "de": "Kohlenhydrate",
            "en": "Carbohydrates",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Fette",
            "en": "Fats",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Proteine",
            "en": "Proteins",
        },
        "values": {
            kcal: 600,
            g: 200
        }
    },
    {
        "name": {
            "de": "Nahrungsfasern",
            "en": "Fibre",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
];
```

## /dietcoach/backend/dietician/chart/macro-categories

> Status: TODO ⚙️

> Priority: 7

> Reuse: -

### Headers

```
Authentication: string
Participant-Id: string
(Macro-Filter: "carbohydrates" | "fats" | "proteins" | "fibre")
```

### Body

```
[basketId1, basketId2, basketId3]: number[]
```

### Response (Example)

```
[
    {
        "name": {
            "de": "Getränke",
            "en": "Drinks",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Früchte",
            "en": "Fruits",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Getreide",
            "en": "Grains",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Öle",
            "en": "Oils",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Verarbeitet",
            "en": "Processed",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Protein",
            "en": "Proteins",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
    {
        "name": {
            "de": "Gemüse",
            "en": "Vegetables",
        },
        "values": {
            "kcal": 600,
            "g": 200
        }
    },
];
```

## /dietcoach/backend/dietician/basket-products

> Status: TODO ⚙️

> Priority: 3

> Reuse: "/shopping-history"

### Headers

```
Authentication: string
Participant-Id: string
```

### Body

```
[basketId1, basketId2, basketId3]: number[]
```

### Response (Example)

```
[
    "basketId1": [
        {
            "productId": 1,
            "name": "Brot",
            "nutriscore": 3,
            "category": {
                "de": "Getreide",
                "en": "Grains"
            },
            "quantity": 10,
            "kcal": 250,
            "protein": 10,
            "fat": 5,
            "carbs": 40,
            "fiber": 5,
            "imageUrl": "https://www.image.com/image.jpg"
        },
    ]
]
```

## TODO: Recommendations (CRUD), Notes (CRUD), All Products (R)
