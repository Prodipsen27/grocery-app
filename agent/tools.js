/**
 * tools.js
 *
 * Tool definitions in Gemini's function calling format.
 *
 * Key differences from Anthropic format:
 *  - Anthropic: array of { name, description, input_schema: { type, properties } }
 *  - Gemini:    array of { functionDeclarations: [{ name, description, parameters: { type, properties } }] }
 *
 * Types are UPPERCASE in Gemini: "OBJECT", "STRING", "NUMBER" (not "object", "string", "number")
 */

export const TOOLS = [
  {
    functionDeclarations: [

      {
        name: "search_products",
        description:
          "Search the grocery store catalog for products by name or keyword. " +
          "Always search before adding — never guess a product ID.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description:
                "Search keyword(s). E.g. 'spinach', 'paneer', 'cumin seeds'. " +
                "Accepts ingredient names, common names, or Hindi names.",
            },
          },
          required: ["query"],
        },
      },

      {
        name: "add_to_cart",
        description:
          "Add a product to the user's cart using a product_id from search_products. " +
          "Do NOT call this if the product is out of stock. If it is out of stock, skip it and notify the user.",
        parameters: {
          type: "OBJECT",
          properties: {
            product_id: {
              type: "STRING",
              description: "The product ID from search_products results.",
            },
            quantity: {
              type: "NUMBER",
              description: "Number of units to add. Default: 1.",
            },
            reason: {
              type: "STRING",
              description: "Why this is being added, e.g. 'Needed for Palak Paneer'.",
            },
          },
          required: ["product_id", "quantity"],
        },
      },

      {
        name: "remove_from_cart",
        description:
          "Remove a product from the cart or reduce its quantity. " +
          "Use when the user explicitly asks to remove something.",
        parameters: {
          type: "OBJECT",
          properties: {
            product_id: {
              type: "STRING",
              description: "The product ID to remove.",
            },
            quantity: {
              type: "NUMBER",
              description:
                "Units to remove. If omitted or exceeds current qty, item is fully removed.",
            },
          },
          required: ["product_id"],
        },
      },

      {
        name: "update_quantity",
        description:
          "Set an exact quantity for a cart item. " +
          "Use when user says 'I need 2 kg of onions' or 'change paneer to 3 packs'.",
        parameters: {
          type: "OBJECT",
          properties: {
            product_id: {
              type: "STRING",
              description: "The product ID to update.",
            },
            quantity: {
              type: "NUMBER",
              description: "The new quantity to set.",
            },
          },
          required: ["product_id", "quantity"],
        },
      },

      {
        name: "suggest_alternative",
        description:
          "Find alternatives for an out-of-stock product. " +
          "Use only if specifically requested by user. Otherwise, simply skip out-of-stock items.",
        parameters: {
          type: "OBJECT",
          properties: {
            product_id: {
              type: "STRING",
              description: "The out-of-stock product ID to find alternatives for.",
            },
          },
          required: ["product_id"],
        },
      },

      {
        name: "get_cart",
        description:
          "Get the current cart — all items, quantities, prices, and total. " +
          "Use when user asks 'what's in my cart' or before modifying cart contents.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },

      {
        name: "clear_cart",
        description:
          "Remove ALL items from the cart. " +
          "Only call if the user explicitly asks to empty or clear their cart.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },

    ],
  },
];
