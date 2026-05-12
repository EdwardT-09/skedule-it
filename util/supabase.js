import { createClient } from "@supabase/supabase-js";

const url = '';
const anonkey = '';

export const supabase = createClient(url, anonkey);