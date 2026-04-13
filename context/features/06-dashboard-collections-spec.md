# Dashboard Collections Spec

## Overview

Replace the dummy collection data displayed in the main area of the dashboard (right side), with actual data from the database. Show 6 cards in the 'collections' section, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

Do not add the items underneath yet. We will do that later.

## Requirements

- Create src/lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Add a vertical band of colour on the left edge of each collection card, where the colour is derived from most-used content type in that collection.
- Show small icons of all types in that collection
- Keep the current design. You can also reference the screenshot
- Update collection stats display
- do not change anything else.

## References


