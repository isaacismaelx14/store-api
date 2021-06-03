# store-api

This is the backend of [React Store](https://github.com/isaacismaelx14/store-react).

# Routes

## `Home`

**GET**

> `http://localhost:3001/`

---

## `User`

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

## `Answer`

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

## `Comments`

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

> interface `IUser` {\
> &nbsp;&nbsp; `id`: **_number_**;\
>  &nbsp;&nbsp; `names`: **_string_**;\
>  &nbsp;&nbsp; `last_names`: **_string_**;\
>  &nbsp;&nbsp; `email`: **_string_**;\
>  &nbsp;&nbsp; `password`: **_string_**;\
>  &nbsp;&nbsp; `sex`: **_number_**;\
>  &nbsp;&nbsp; `direction`: **_string_** | **_undefined_**;\
>  &nbsp;&nbsp; `cart`: **_string_**;\
>  &nbsp;&nbsp; `birthday`: **_Date_**;\
>  &nbsp;&nbsp; `type`: **_number_**;\
>  &nbsp;&nbsp; `created_at`: **_Date_**; \
> }

> interface `IChangePassword` {\
>  &nbsp;&nbsp; `new_pwd`: **_string_**;\
>  &nbsp;&nbsp; `old_pwd`: **_string_**;\
> }

> interface `ILogin` {\
>  &nbsp;&nbsp; `email`: **_string_**;\
>  &nbsp;&nbsp; `password`: **_string_**;\
> }

## `Seller`:

> interface `ISeller` {
> &nbsp;&nbsp; `id`: **_number_**;\
>  &nbsp;&nbsp; `user_id`: **_number_**;\
>  &nbsp;&nbsp; `name`: **_string_**;\
>  &nbsp;&nbsp; `description`: **_string_**;\
>  &nbsp;&nbsp; `direction`: **_string_**;\
>  &nbsp;&nbsp; `rank`: **_number_**;\
>  &nbsp;&nbsp; `accepted_by`: **_number_**;\
>  &nbsp;&nbsp; `created_date`: **_Date_**;\
> }

## `Question`:

> interface `IQuestion` {\
>  &nbsp;&nbsp; `id`: **_number_**;\
>  &nbsp;&nbsp; `product_id`: **_number_**;\
>  &nbsp;&nbsp; `user_id`: **_number_**;\
>  &nbsp;&nbsp; `question`: **_string_**;\
>  &nbsp;&nbsp; `star`: **_number_**;\
>  &nbsp;&nbsp; `created_date`: **_number_**;\
> }

## `Product`:

> interface `IProducts` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `picture_id`: **_number_**;\
> &nbsp;&nbsp; `seller_id`: **_number_**;\
> &nbsp;&nbsp; `category_id`: **_number_**;\
> &nbsp;&nbsp; `title`: **_string_**;\
> &nbsp;&nbsp; `price`: DoubleRange;\
> &nbsp;&nbsp; `stock`: **_number_**;\
> &nbsp;&nbsp; `about`: **_string_**;\
> &nbsp;&nbsp; `tags`: **_string_**;\
> &nbsp;&nbsp; `created_date`: **_Date_**;\
> }

## `Description`:

> interface `IDescription` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `product_id`: **_number_**;\
> &nbsp;&nbsp; `color`: **_string_**;\
> &nbsp;&nbsp; `brand`: **_string_**;\
> &nbsp;&nbsp; `dimensions`: **_string_**;\
> &nbsp;&nbsp; `weigth`: **_string_**;\
> &nbsp;&nbsp; `other`: **_string_**;\
> }

## `Comment`:

> interface `IComment` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `product_id`: **_number_**;\
> &nbsp;&nbsp; `user_id`: **_number_**;\
> &nbsp;&nbsp; `comment`: **_string_**;\
> &nbsp;&nbsp; `star`: **_number_**;\
> &nbsp;&nbsp; `created_date`: **_number_**;\
> }

## `Category`:

> interface `ICategory` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `category`: **_string_**;\
> }

## `Answer`:

> interface `IAnswer` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `parent_id`: **_number_**;\
> &nbsp;&nbsp; `user_id`: **_number_**;\
> &nbsp;&nbsp; `answer`: **_string_**;\
> &nbsp;&nbsp; `created_date`: **_Date_**;\
> }

## `Seller Request`:

> interface `ISellerRequest` {\
> &nbsp;&nbsp; `id`: **_number_**;\
> &nbsp;&nbsp; `user_id`: **_number_**;\
> &nbsp;&nbsp; `name`: **_string_**;\
> &nbsp;&nbsp; `description`: **_string_**;\
> &nbsp;&nbsp; `direction`: **_string_**;\
> &nbsp;&nbsp; `state`: **_string_**;\
> &nbsp;&nbsp; `admin_message`: **_string_**;\
> &nbsp;&nbsp; `created_date`: **_Date_**;\
> }
