# Authentication Rest Api with Node.js, TypeScript, Typegoose & Zod

# Getting started

```
npm install
```

- create .env file
- generate new keys `(Key Size: 2048 bit)`: https://travistidwell.com/jsencrypt/demo/

```
DB_URI="your_database_uri"
DB_NAME="your_database_name"
ACCESS_TOKEN_PRIVATE_KEY="[Private Key]"
ACCESS_TOKEN_PUBLIC_KEY="[Public Key]"

REFRESH_PRIVATE_KEY="[Refresh Private Key]"
REFRESH_PUBLIC_KEY="[Refresh Public Key]"
```

- Start Application

```
npm run dev
```

## Dependencies

```
npm i @typegoose/typegoose express mongoose config argon2 pino morgan dayjs nanoid@3.3.6 nodemailer lodash jsonwebtoken dotenv zod
```

## Dev Dependencies

```
npm i @types/config @types/express @types/jsonwebtoken @types/lodash @types/morgan @types/nodemailer pino-pretty ts-node-dev typescript
```

## Warning

- Do not use nanoid versions higher than 3.3.6

## Video tutorial

https://www.youtube.com/watch?v=qylGaki0JhY
