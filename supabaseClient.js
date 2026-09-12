import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tdebewpsjvtpkryrtlgs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZWJld3BzanZ0cGtyeXJ0bGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3OTM3MjMsImV4cCI6MjEwNDM2OTcyM30.UU_GZvYaQUM2ywBzZS4cvN_k_wPcClnfXb2fHEYSwUo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
