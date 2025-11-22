# Diagrama Entidad Relación - RopaBase

```mermaid
erDiagram
  User ||--o{ ClothingItem : owns
  User ||--o{ Account : has
  User ||--o{ Session : has

  User {
    string id
    string name
    string email
    string password
    string image
  }

  ClothingItem {
    int id
    string name
    string category
    string color
    string brand
    string imageUrl
    string ownerId
  }

  Account {
    string id
    string userId
    string type
    string provider
    string providerAccountId
  }

  Session {
    string id
    string sessionToken
    string userId
    datetime expires
  }

  VerificationToken {
    string identifier
    string token
    datetime expires
  }