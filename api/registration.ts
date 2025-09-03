import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or ANON KEY is missing in environment variables!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const registration = new Hono();

type RegistrationBody = {
  firstName: string;
  lastName: string;
  occupation: string;
  residence: string;
  fileUrl: string;
};

registration.post('/', async (c) => {
  const body: RegistrationBody = await c.req.json();
  const { firstName, lastName, occupation, residence, fileUrl } = body;

  if (!firstName || !lastName || !occupation || !residence || !fileUrl) {
    return c.json({ error: 'All fields are required' }, 400);
  }

  const { error } = await supabase
    .from('users')
    .insert([{
      fname: firstName,
      Lname: lastName,
      Occupation: occupation,
      residence: residence,
      file_url: fileUrl
    }]);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Submission saved successfully' });
});

export default registration;
