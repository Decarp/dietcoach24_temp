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

## /dietcoach/backend/dietician/participants

> Status: TODO ⚙️

> Priority: 3

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
    ...
]
```

## /dietcoach/backend/dietician/participant-details

> Status: TODO ⚙️

> Priority: 4

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

> Priority: 5

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
    ...
]
```

## /dietcoach/backend/dietician/basket-products

> Status: TODO ⚙️

> Priority: 2

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
            "name": "Bio Vollkornbrot 350g",
            "nutriscore": 2,
            "majorCategory": {
                "de": "Getreideprodukte & Kartoffeln",
                "en": "Grain products & potatoes"
            },
            "minorCategory": {
                "de": "Brot",
                "en": "Brot",
            }
            "quantity": 10,
            "kcal": 250,
            "protein": 8,
            "fat": 2,
            "carbohydrates": 60,
            "fiber": 5,
            "salt": 1,
            "imageUrl": "https://www.image.com/image.jpg"
        },
        ...
    ],
    ...
]
```

## TODO: Recommendations (CRUD), Notes (CRUD), All Products (R)
