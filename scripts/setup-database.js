const { createClient } = require('@supabase/supabase-js')

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fmuxjttjlxvrkueaacvy.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdXhqdHRqbHh2cmt1ZWFhY3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDY5MTQsImV4cCI6MjA2ODcyMjkxNH0.xXojJGgJNLpvuiyvbXTcALmbo0qyqExUroHo0tA2WPA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('Configuration de la base de données...')
  console.log('URL:', supabaseUrl)
  console.log('')

  try {
    // Vérifier si la table existe déjà
    const { data: existingTickets, error: checkError } = await supabase
      .from('tickets')
      .select('id')
      .limit(1)

    if (!checkError) {
      console.log('✅ La table tickets existe déjà!')
      
      // Vérifier s'il y a des données
      const { count } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
      
      console.log(`   Nombre de tickets existants: ${count}`)
      
      if (count === 0) {
        // Ajouter des tickets d'exemple
        console.log('Ajout de tickets d\'exemple...')
        const { error: insertError } = await supabase
          .from('tickets')
          .insert([
            { title: 'Réunion équipe', color: '#FFE5B4' },
            { title: 'Appel client', color: '#B4E5FF' },
            { title: 'Révision projet', color: '#FFB4B4' },
            { title: 'Planning sprint', color: '#D4FFB4' }
          ])
        
        if (insertError) {
          console.error('Erreur lors de l\'ajout des tickets:', insertError)
        } else {
          console.log('✅ Tickets d\'exemple ajoutés!')
        }
      }
    } else {
      console.log('❌ La table tickets n\'existe pas.')
      console.log('   Code d\'erreur:', checkError.code)
      console.log('   Message:', checkError.message)
      console.log('')
      console.log('La table doit être créée manuellement via l\'interface Supabase.')
      console.log('Utilisez le fichier: supabase/create-table-simple.sql')
      console.log('')
      console.log('Lien direct vers l\'éditeur SQL:')
      console.log('https://supabase.com/dashboard/project/fmuxjttjlxvrkueaacvy/sql/new')
    }

    process.exit(0)

  } catch (error) {
    console.error('Erreur:', error)
    process.exit(1)
  }
}

setupDatabase()