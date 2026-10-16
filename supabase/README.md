# Supabase

`schema.sql` mirrors what is already applied to the Dev.portfolio project
(`SUPABASE_URL`). It is here as a record of the shape the API writes to, not as
something the deploy runs.

RLS is on for every table with no anon or authenticated policies, so the only
way in is the secret key the API holds (`SUPABASE_SECRET_KEY`). Nothing in
`packages/web` ever sees it.

Schema changes go in a new numbered file next to `schema.sql`
(`001_what-changed.sql`) and get applied by hand in the Supabase SQL editor.
