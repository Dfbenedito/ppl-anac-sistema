import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = req.query.userId || decoded.id

    // Buscar IDs das questões favoritas
    const { data: favoritas, error: favoritasError } = await supabase
      .from('favoritas')
      .select('questao_id')
      .eq('usuario_id', userId)

    if (favoritasError) throw favoritasError

    if (!favoritas || favoritas.length === 0) {
      return res.status(200).json([])
    }

    // Buscar as questões correspondentes
    const questoesIds = favoritas.map(f => f.questao_id)
    
    const { data: questoes, error: questoesError } = await supabase
      .from('questoes')
      .select('*')
      .in('id', questoesIds)

    if (questoesError) throw questoesError

    res.status(200).json(questoes || [])
  } catch (error) {
    console.error('Erro ao buscar favoritas:', error)
    res.status(500).json({ error: 'Erro ao buscar favoritas' })
  }
}
