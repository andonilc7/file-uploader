This is a web application built using Express.js, EJS, and Prisma that allows authenticated users to securely upload and manage files within a nested folder structure. Uploaded files are stored in Supabase Cloud, and file handling is managed via Multer middleware.

This project helped me learn a lot about connecting a bunch of different moving parts, especially with Supabase which I never used before. This was also my first project using an ORM (Prisma ORM with PostgreSQL as the backend), so this introduced me to schema migrations and version control for database changes.

I handled authenticated using Passport.js and its Local Strategy. This type of authentication is session-based, with the session data being persisted in the database. I used bcrypt for password hashing.