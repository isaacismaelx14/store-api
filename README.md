# store-api

This is the backend of [React Store](https://github.com/isaacismaelx14/store-react).

# Index

- [Routes:](#Routes)
  - [Home](#Home)
  - [User](#User)
  - [Answer](#Answer)
  - [Comments](#Comments)
  - [Seller](#Seller)
  - [Product](#Product)
  - [Categories](#Categories)
- [Types:](#Types)
  - [User](#User-1)
  - [Seller](#Seller-1)
  - [Question](#Question)
  - [Product](#Product-1)
  - [Description](#Description)
  - [Comment](#Comment)
  - [Category](#Category)
  - [Answer](#Answer-1)
  - [Seller Request](#seller-request)

# Routes

## Home

**GET**

> http://localhost:3001/

---

## User

**GET**

> http://localhost:3001/users \
> http://localhost:3001/users/${id}

**POST**

> http://localhost:3001/users \
>  http://localhost:3001/users/login

**PATCH**

> http://localhost:3001/users/${id} \
> http://localhost:3001/users/change-password/${id}

**DELETE**

> http://localhost:3001/users/${id}

---

## Products

**GET**

> http://localhost:3001/products \
> http://localhost:3001/products/${id}

**POST**

> http://localhost:3001/products

**PATCH**

> http://localhost:3001/products/${id}

**DELETE**

> http://localhost:3001/products/${id}

---

## Answer

**GET**

> http://localhost:3001/answer \
> http://localhost:3001/answer/${id}

**POST**

> http://localhost:3001/answer

**PATCH**

> http://localhost:3001/answer/${id} \

**DELETE**

> http://localhost:3001/answer/${id}

---

## Comments

**GET**

> http://localhost:3001/comments \
> http://localhost:3001/comments/${id} \
> http://localhost:3001/comments/by-product/${id} \
> http://localhost:3001/comments/by-user/${id}

**POST**

> http://localhost:3001/comments

**PATCH**

> http://localhost:3001/comments/${id}

**DELETE**

> http://localhost:3001/comments/${id}

---

## Sellers

**GET**

> http://localhost:3001/sellers \
> http://localhost:3001/sellers/${id}

**POST**

> http://localhost:3001/sellers

**PATCH**

> http://localhost:3001/sellers/${id}

**DELETE**

> http://localhost:3001/sellers/${id}

---

## Categories

**GET**

> http://localhost:3001/categories \
> http://localhost:3001/categories/${id} \
> http://localhost:3001/categories/by-product/${id}

**POST**

> http://localhost:3001/categories

**PATCH**

> http://localhost:3001/categories/${id}

**DELETE**

> http://localhost:3001/categories/${id}

---

## Request Seller

**GET**

> http://localhost:3001/requests/seller \
> http://localhost:3001/requests/seller/${id}

**POST**

> http://localhost:3001/requests/seller \
> http://localhost:3001/requests/seller/accept/${id}

**PATCH**

> http://localhost:3001/requests/seller/${id}

**DELETE**

> http://localhost:3001/requests/seller/${id}

<!--  -->

# Types

## `User`:

```
interface IUser {
    id: number;
    names: string;
    last_names: string;
    email: string;
    password: string;
    sex: number;
    direction: string | undefined;
    cart: string;
    birthday: Date;
    type: number;
    create_date: Date;
}
```

```
interface IChangePassword {
    new_pwd: string;
    old_pwd: string;
}
```

```
interface ILogin {
    email: string;
    password:string;
}
```

## Seller:

```
interface ISeller {
    id: number;
    user_id: number;
    name:string;
    description:string;
    direction:string;
    rank: number;
    accepted_by: number;
    created_date:Date;
}
```

## Question:

```
interface IQuestion {
    id: number;
    product_id: number;
    user_id: number;
    question:string;
    star: number;
    created_date:number;
}
```

## Product:

```
interface IProducts {
    id: number;pictureid: number
    seller_id: number;
    category_id: number;
    title:string;
    price: DoubleRange;
    stock: number;
    about:string;
    tags:string;
    created_date:Date;
}
```

## Description:

```
interface IDescription {
    id: number;
    product_id: number;
    color:string;
    brand:string;
    dimensions:string;
    weigth:string;
    other:string;
}
```

## Comment:

```
interface IComment {
    id: number;
    product_id: number;
    user_id: number;
    comment:string;
    star: number;
    created_date:number;
}
```

## Category:

```
interface ICategory {
    id: number;
    category:string;
}
```

## Answer:

```
interface IAnswer {
    id: number;
    parent_id: number;
    user_id: number;
    answer:string;
    created_date:Date;
}
```

## Seller Request:

```
interface ISellerRequest {
    id: number;
    user_id: number;
    name:string;
    description:string;
    direction:string;
    state:string;
    admin_message:string;
    created_date:Date;
}
```
