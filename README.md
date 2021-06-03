# store-api

This is the backend of [React Store](https://github.com/isaacismaelx14/store-react).

# Routes

## Home

**GET**

> `http://localhost:3001/`

## User

---

**GET**

> `http://localhost:3001/users`\
> `http://localhost:3001/users/${id}`

**POST**

> `http://localhost:3001/users`\
>  `http://localhost:3001/users/login`

**PATCH**

> `http://localhost:3001/users/${id}`\
> `http://localhost:3001/users/change-password/${id}`

**DELETE**

> `http://localhost:3001/users/${id}`

---

## Answer

**GET**

> `http://localhost:3001/answer`\
> `http://localhost:3001/answer/${id}`

**POST**

> `http://localhost:3001/answer`

**PATCH**

> `http://localhost:3001/answer/${id}`\

**DELETE**

> `http://localhost:3001/answer/${id}`

---

## Comments

**GET**

> `http://localhost:3001/comments`\
> `http://localhost:3001/comments/${id}`\
> `http://localhost:3001/comments/by-product/${id}`\
> `http://localhost:3001/comments/by-user/${id}`

**POST**

> `http://localhost:3001/comments`

**PATCH**

> `http://localhost:3001/comments/${id}`

**DELETE**

> `http://localhost:3001/comments/${id}`

<!--  -->

# Types

## `User`:

```
interface IUser {
    id: number;
    names: string;
    lastnames: string;
    email: string;
    password: string;
    sex: number;
    direction: string | undefined;
    cart: string;
    birthday: Date;
    type: number;
    createdat: Date;
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
    userid: number;
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
    productid: number;
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
    productid: number;
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
    productid: number;
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
    parentid: number;
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
