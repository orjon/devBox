# Dashboard Items Spec

## Overview

Replace the dummy item data displayed in the main area of the dashboard (right side), with actual data from the database. This includes both pinned and recent items. It should look how it does now, but instead of using data from @src/lib/mock-data.ts, it should be from the Neon database using Prisma.

If there are no pinned items, nothing should display there.

## Requirements

- Create src/lib/db/items.ts with data fetching functions
- Fetch items directly in server component
- item card border edge colour derived from the item type colour.
- Display item type tags and anything else currently there. You can also reference the screenshot if needed

## References
