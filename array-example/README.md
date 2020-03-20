# Array Based Application Flows

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
    "token": "name"
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
  "friends": {
    [
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
}
```
