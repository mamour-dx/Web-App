import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dbhfbfvcbnfnekuzzhul.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGZiZnZjYm5mbmVrdXp6aHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NDQxODUsImV4cCI6MjAyODQyMDE4NX0.hppRnlR7q1WOC288sO1qmqzfM4WlE8yeRPlFdAR6dUs"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;