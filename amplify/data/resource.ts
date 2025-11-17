import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Product database table with a "content" field.
=========================================================================*/
const schema = a.schema({
  // Product Model
  Product: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      brand: a.string().required(),
      priceCents: a.integer().required(),
      images: a.string().array(), // S3 URLs
      tags: a.string().array(),
      specs: a.json(), // Flexible key-value specs
      featured: a.boolean().default(false),
      categoryId: a.id(),
      category: a.belongsTo('Category', 'categoryId'),
      description: a.string().required(),
      stock: a.integer().default(0),
      status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']), // Public can read
      allow.group('ADMINS'), // Only admins can create/update/delete
    ]),

  // Category Model
  Category: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      icon: a.string(),
      products: a.hasMany('Product', 'categoryId'),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.group('ADMINS'),
    ]),

  // Order Model
  Order: a
    .model({
      orderNumber: a.string().required(),
      customerEmail: a.string().required(),
      customerName: a.string(),
      items: a.hasMany('OrderItem', 'orderId'),
      totalCents: a.integer().required(),
      status: a.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      stripeSessionId: a.string(),
    })
    .authorization((allow) => [
      allow.owner(), // Customers see their own orders
      allow.group('ADMINS'),
    ]),

  // OrderItem Model
  OrderItem: a
    .model({
      orderId: a.id().required(),
      order: a.belongsTo('Order', 'orderId'),
      productId: a.string().required(),
      productName: a.string().required(),
      quantity: a.integer().required(),
      priceCents: a.integer().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('ADMINS'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: products } = await client.models.Product.list()

// return <ul>{products.map(product => <li key={product.id}>{product.name}</li>)}</ul>
