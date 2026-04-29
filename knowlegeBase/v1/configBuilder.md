Design Proposal: Config Builder & Schema Registry
This document outlines the architecture for a dynamic, type-safe "Config Builder" system that ensures data integrity and prevents the creation of "nonsense" credit card reward configurations.

1. Problem Definition
The current reward engine relies on a 
CardConfig
 structure that is manually authored. As we transition to a UI-based "Config Builder":

Dynamic Entities: Categories like "Amazon Pay" or "Dineout" are dynamic (stored in a DB).
Relational Constraints: A spend_intent_key must resolve to a RailID that exists, which in turn must resolve to a CategoryID that belongs to that Rail.
Nonsense Prevention: We must prevent errors like mapping "Fuel Spends" to a "Voucher" rail that doesn't support fuel.
2. Registry Architecture (The Source of Truth)
Instead of a simple list of strings, the Registry should be a structured metadata store. This is what the UI fetches to build its dropdowns and validation nodes.

Granular Metadata
Each entity in the registry should carry its own "policy":

typescript
interface CategoryMetadata {
  id: string;
  display_name: string;
  default_rate: number;
  is_restricted_by_default: boolean;
  allowed_spend_intents: string[]; // e.g. ["amazon"]
}
interface RailMetadata {
  id: string;
  rail_type: "Voucher" | "Direct" | "Portal";
  categories: CategoryMetadata[];
}
3. Database Schema Proposal
To maintain integrity, we should avoid storing arbitrary strings in the card configs. Instead, we use a relational model.

Tables
master_spend_intents: (e.g. amazon, fuel) - The global list of what a user can spend on.
master_rails: (e.g. vouchers, smartbuy) - Common rail types.
card_definitions: The top-level card (e.g. hdfc_infinia).
card_rail_configs: Join table connecting a Card to its Rails.
card_category_configs: Join table connecting a Rail to its specific Categories for that card.
Integrity Enforcement (Enums vs. Lookup Tables)
Lookup Tables (Recommended): Store possible rail_ids and category_ids in their own tables with Foreign Key constraints.
Benefits:
Autocomplete: The UI fetches from these tables.
Safety: The DB will reject any config that references a non-existent rail_id.
Expansion: Adding a new category is as simple as inserting a row into the master_categories table.
4. Multi-Stage Validation
A. UI Level (Discovery-based)
The UI should be "Path-Constrained". When a user picks a Rail, the "Category" dropdown only shows categories that are linked to that Rail in the Registry.

B. API Level (Zod + Custom Logic)
Before saving a config, the backend runs a validator:

Schema Check: Is the JSON structure correct? (Zod)
Relational Check: Does the spend_limit_id reference an ID that exists in the spend_limits object?
Global Check: Does the spend_intent_key exist in our master_spend_intents table?
C. Engine Level (TypeScript)
Use Discriminated Unions and Generic Constraints to ensure that once the config is loaded into the rewards engine, the code can process it without "undefined" errors.

5. Summary & Next Steps
Record the "Why": The primary reason for a registry is to decouple the data (categories) from the logic (the calculator).
Define the Registry API: Create a mock fetch that returns a fully fleshed-out registry for testing.
Build the "Strict" Validator: Implement the cross-referencing logic mentioned above.
How does this relational approach sound? Does it address your concerns about granularity?




### Going deeper into the types part of the problem

To ensure type safety while dealing with a dynamic list of categories (especially when they are stored in a database), you generally move from **static types** to **schema-driven validation** and **generic constraints**.

Here are the typical approaches for solving this in a way that prevents the UI from creating "nonsense" configurations:

### 1. The "Dependent Types" Pattern (TypeScript)
If you want the compiler (or your IDE) to help you while writing code, you can use a generic structure where the `category_id` is constrained by the `rail_id`.

In TypeScript, you can define a relationship where the valid categories for a routing entry are derived from the `rails` object itself:

```typescript
// A helper type that ensures category_id exists within the chosen rail
type RoutingEntry<TRails extends Record<string, RailConfig>> = {
  [RailID in keyof TRails]: {
    rail_id: RailID;
    category_id: keyof TRails[RailID]['categories'];
  }
}[keyof TRails];

interface CardConfig<TRails extends Record<string, RailConfig>> {
  card_id: string;
  rails: TRails;
  // This ensures that the routing can only point to existing rails and their categories
  spend_intent_routing: Record<string, RoutingEntry<TRails>>;
}
```
**Why this works**: If you change a key in `rails`, TypeScript will immediately flag errors in `spend_intent_routing` if the corresponding `category_id` or `rail_id` no longer matches.

### 2. Runtime Validation with a Registry (Zod)
Since your categories are dynamic and coming from a DB, static types won't exist at build time for the DB records. You should use a runtime validation library like **Zod**.

When your UI fetches the "Allowable Categories" from the DB, you can construct a validator:

```typescript
import { z } from "zod";

// 1. Fetch from DB
const validCategories = ["dineout", "swiggy_app", "zomato_pro"]; // Dynamic

// 2. Create a dynamic schema
const CategorySchema = z.string().refine((val) => validCategories.includes(val), {
  message: "Invalid category for this rail",
});

// 3. Validate the incoming config from the UI
const ConfigSchema = z.object({
  rail_id: z.string(),
  category_id: CategorySchema,
});
```

### 3. The "Master Schema" (The DB as Source of Truth)
To prevent the UI from "creating nonsense," the UI should not be free-form. It should be **discovery-based**:

1. **The Backend provides a Manifest**: Before the UI loads, it fetches a `manifest.json` which looks like this:
   ```json
   {
     "rails": {
       "vouchers": ["amazon_pay", "swiggy", "flipkart"],
       "direct": ["fuel", "rent", "education"]
     }
   }
   ```
2. **UI State Management**: When a user selects a Rail in the dropdown, the "Category" dropdown is filtered to only show categories present in that Rail based on the manifest.
3. **Draft Validation**: Every time a user changes a node, run a "dry-run" validation.

### 4. Branded Types / Nominal Typing
If you want to be extremely strict in your engine, you can use **Branded Types**. This prevents a string that *looks* like a category from being used unless it has been "blessed" by a validator.

```typescript
type CategoryId = string & { readonly __brand: unique symbol };

function validateCategory(id: string): CategoryId {
    if (/* check DB/Manifest */) return id as CategoryId;
    throw new Error("Invalid Category");
}
```

### Recommendation for your Config Builder:
The **Dependent Types** (Approach #1) combined with a **Manifest-driven UI** (Approach #3) is the gold standard. 

- Use the **Manifest** to drive the UI dropdowns (ensuring the user *cannot* pick a nonsense category).
- Use **TypeScript Generics** in your engine code to ensure that if the manifest structure changes, your code knows how to handle the relationships.
- Use **Zod** at the API boundary to verify that the JSON blob sent by the UI matches the relationships defined in your DB.

Would you like me to demonstrate how to implement a Zod-based validator that checks these cross-references between the rails and the routing?