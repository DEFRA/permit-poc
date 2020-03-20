# Array Based Application Flows

This is a _very_ rough sketch of an idea for configuration driven
multi-step forms.

UI component/module capabilities/contracts are described
independently of routing (which describes order and direction).

Combining the two gives a verifiable output.

Using the branching method described in other areas it should be
possible to create, verify and model possible outcomes without
touching underlying code.


## Modules/Screens

`name.module.json`
```json
{
  "module_name": "name",
  "inputs": [
    {
      "label": "Title",
      "type": "enum",
      "options": ["Mr", "Mrs", "Miss", "Dr"]
    }
    {
      "label": "First Name",
      "type: string"
    },
    {
      "label": "Last Name",
      "type: string"
    }
  ],
  "outputs": {
    "label": "full_name",
    "output": "{Title}, {First Name}, {Last Name}"
  }
}
```

## Routing

`friendship_group__route.json`
```json
[
  {
    "token": "name",
    "module": "name"
  },
  {
    "token": "friends",
    "sub_tasks": [
      {
        "token": "best_friend",
        "sub_tasks": "friendship_group__route.json"
      }
    ]
  },
  {
    "token": "friends",
    "sub_tasks": [
      {
        "token": "other_friend",
        "sub_tasks": "friendship_group__route.json"
      }
    ]
  },
  {
    "token": "friends",
    "sub_tasks": [
      {
        "token": "some_person",
        "sub_tasks": "friendship_group__route.json"
      }
    ]
  }
]
```

## Result

Possible URLs:

- `/`
- `/name`
- `/friends/best_friend`
  - `/friends/best_friend/name`
  - `/friends/best_friend/friends/best_friend`
  - `/friends/best_friend/friends/other_friend`
  - `...`
- `/friends/other_friend`
- `/friends/other_friend`
- `/friends/some_person`


`output.json`
```json
{
  "name": "Mr A B",
  "friends": [
    {
      "best_friend": {
        "name": "Mr C D",
        "friends": {...}
      }
    },
    {
      "other_friend": {
        "name": "Mrs E F",
        "friends": {...}
      }
    }
  ]
}
```
