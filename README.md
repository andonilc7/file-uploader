This is a web application built using Express.js, EJS, and Prisma that allows authenticated users to securely upload and manage files within a nested folder structure. Uploaded files are stored in Supabase Cloud, and file handling is managed via Multer middleware.

This project helped me learn a lot about connecting a bunch of different moving parts, especially with Supabase which I never used before. This was also my first project using an ORM (Prisma ORM with PostgreSQL as the backend), so this introduced me to schema migrations and version control for database changes.

I handled authenticated using Passport.js and its Local Strategy. This type of authentication is session-based, with the session data being persisted in the database. I used bcrypt for password hashing.

The db is hosted on Neon and the Web Service (Express app) is hosted on Render. This hosting was especially helpful for getting more comfortable with dev vs prod environments and setting build commands to migrate dev to prod db changes. In the future, I will try to do even more scripting/automation for this, but I definitely did a better job than other times with this. This is because, instead of changing env variables in my local project and setting up the migrations to prod there, I kept dev env variables local and only did the prod ones directly in Render so that I could get more experience with keeping the environments separate.

Link to File Uploader Web App: https://file-uploader-fm9a.onrender.com