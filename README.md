
Core features:

- [Authentication](#users-authentication)
- [Access Control](#access-control)
- [Shopping Cart](#shopping-cart)
- [Checkout](#checkout)
- [Paywall](#paywall)
- [Layout Builder](#layout-builder)
- [SEO](#seo)
- [Website](#website)


- #### Users (Authentication)

  Users are auth-enabled and encompass both admins and customers based on the value of their `roles` field. Only `admin` users can access your admin panel to manage your store whereas `customer` can authenticate on your front-end to create [shopping carts](#shopping-cart) and place [orders](#orders) but have limited access to the platform. See [Access Control](#access-control) for more details.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Products

  Products are linked to Stripe via a custom select field that is dynamically populated in the sidebar of each product. This field fetches all available products in the background and displays them as options. Once a product has been selected, prices get automatically synced between Stripe and Payload through [Payload Hooks](https://payloadcms.com/docs/hooks) and [Stripe Webhooks](https://stripe.com/docs/webhooks). See [Stripe](#stripe) for more details.

  All products are layout builder enabled so you can generate unique pages for each product using layout building blocks, see [Layout Builder](#layout-builder) for more details.

  Products can also restrict access to content or digital assets behind a paywall (gated content), see [Paywall](#paywall) for more details.

- #### Orders

  Orders are created when a user successfully completes a checkout. They contain all the data about the order including the products purchased, the total price, and the user who placed the order. See [Checkout](#checkout) for more details.

- #### Pages

  All pages are layout builder enabled so you can generate unique layouts for each page using layout-building blocks, see [Layout Builder](#layout-builder) for more details.

- #### Media

  This is the uploads enabled collection used by products and pages to contain media like images, videos, downloads, and other assets.

- #### Categories

  A taxonomy used to group products together. Categories can be nested inside of one another, for example "Courses > Technology". See the official [Payload Nested Docs Plugin](https://github.com/payloadcms/plugin-nested-docs) for more details.

### Globals

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- `Header`

  The data required by the header on your front-end like nav links.

- `Footer`

  Same as above but for the footer of your site.

## Access control

Basic role-based access control is setup to determine what users can and cannot do based on their roles, which are:

- `admin`: They can access the Payload admin panel to manage your store. They can see all data and make all operations.
- `customer`: They cannot access the Payload admin panel and can perform limited operations based on their user (see below).

This applies to each collection in the following ways:

- `users`: Only admins and the user themselves can access their profile. Anyone can create a user but only admins can delete users.
- `products`: Everyone can access products, but only admins can create, update, or delete them. Paywall-enabled products may also have content that is only accessible to only users who have purchased the product. See [Paywall](#paywall) for more details.

For more details on how to extend this functionality, see the [Payload Access Control](https://payloadcms.com/docs/access-control/overview#access-control) docs.

## Shopping cart

Logged-in users can have their shopping carts saved to their profiles as they shop. This way they can continue shopping at a later date or on another device. When not logged in, the cart can be saved to local storage and synced to Payload on the next login. This works by maintaining a `cart` field on the `user`:

```ts
{
  name: 'cart',
  label: 'Shopping Cart',
  type: 'object',
  fields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      fields: [
        // product, quantity, etc
      ]
    },
    // other metadata like `createdOn`, etc
  ]
}
```

## Stripe

Payload itself handles no currency exchange. All payments are processed and billed using [Stripe](https://stripe.com). This means you must have access to a Stripe account via an API key, see [Connect Stripe](#connect-stripe) for how to get one. When you create a product in Payload that you wish to sell, it must be connected to a Stripe product by selecting one from the field in the product's sidebar, see [Products](#products) for more details. Once set, data is automatically synced between the two platforms in the following ways:

1. Stripe to Payload using [Stripe Webhooks](https://stripe.com/docs/webhooks):
   - `product.created`
   - `product.updated`
   - `price.updated`

1. Payload to Stripe using [Payload Hooks](https://payloadcms.com/docs/hooks/overview):
   - `user.create`

For more details on how to extend this functionality, see the the official [Payload Stripe Plugin](https://github.com/payloadcms/plugin-stripe).

### Connect Stripe

To integrate with Stripe, follow these steps:

1. You will first need to create a [Stripe](https://stripe.com) account if you do not already have one.
1. Retrieve your [Stripe API keys](https://dashboard.stripe.com/test/apikeys) and paste them into your `env`:
   ```bash
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   ```

## Checkout

A custom endpoint is opened at `POST /api/create-payment-intent` which initiates the checkout process. This endpoint totals your cart and creates a [Stripe Payment Intent](https://stripe.com/docs/payments/payment-intents). The total price is recalculated on the server to ensure accuracy and security, and once completed, passes the `client_secret` back in the response for your front-end to finalize the payment. Once the payment has succeeded, an [Order](#orders) will be created in Payload with a `stripePaymentIntentID`. Each purchased product will be recorded to the user's profile, and the user's cart will be automatically cleared.

## Paywall

Products can optionally restrict access to content or digital assets behind a paywall. This will require the product to be purchased before it's data and resources are accessible. To do this, a `purchases` field is maintained on each user to track their purchase history:

```ts
{
  name: 'purchases',
  label: 'Purchases',
  type: 'array',
  fields: [
    {
      name: 'product',
      label: 'Product',
      type: 'relationship',
      relationTo: 'products',
    },
    // other metadata like `createdOn`, etc
  ]
}
```

Then, a `paywall` field is added to the `product` with `read` access control set to check for associated purchases. Every time a user requests a product, this will only return data to those who have purchased it:

```ts
{
  name: 'paywall',
  label: 'Paywall',
  type: 'blocks',
  access: {
    read: checkUserPurchases,
  },
  fields: [
    // assets
  ]
}
```

## Layout Builder

Create unique product and page layouts for any type fo content using a powerful layout builder. This template comes pre-configured with the following layout building blocks:

- Hero
- Content
- Media
- Call To Action
- Archive

Each block is fully designed and built into the front-end website that comes with this template. See [Website](#website) for more details.

## Draft Preview

All pages and products are draft-enabled so you can preview them before publishing them to your website. To do this, these collections use [Versions](https://payloadcms.com/docs/configuration/collections#versions) with `drafts` set to `true`. This means that when you create a new page or product, it will be saved as a draft and will not be visible on your website until you publish it. This also means that you can preview your draft before publishing it to your website. To do this, we automatically format a custom URL which redirects to your front-end to securely fetch the draft version of your content.

Since the front-end of this template is statically generated, this also means that pages and products will need to be regenerated as changes are made to published documents. To do this, we use an `afterChange` hook to regenerate the front-end when a document has changed and its `_status` is `published`.

For more details on how to extend this functionality, see the official [Draft Preview Example](https://github.com/payloadcms/payload/tree/main/examples/draft-preview).

## SEO

This template comes pre-configured with the official [Payload SEO Plugin](https://github.com/payloadcms/plugin-seo) for complete SEO control from the admin panel. All SEO data is fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Redirects

If you are migrating an existing site or moving content to a new URL, you can use the `redirects` collection to create a proper redirect from old URLs to new ones. This will ensure that proper request status codes are returned to search engines and that your users are not left with a broken link. This template comes pre-configured with the official [Payload Redirects Plugin](https://github.com/payloadcms/plugin-redirects) for complete redirect control from the admin panel. All redirects are fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.