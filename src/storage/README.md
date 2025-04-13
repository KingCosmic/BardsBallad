We moved from rxdb to straight dexiejs for more control over the database.

# Schemas
They're stored in the `schemas` folder. Each schema is a Zod schema. The schemas are used to validate the data before it is stored in the database. The schemas are also used to generate the types for the data, validations can be turned off for better performance.