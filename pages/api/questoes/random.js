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

  // Verificar autenticação
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)

    const { materia, quantidade = 10 } = req.query

    let query = supabase
      .from('questoes')
      .select('*')

    if (materia) {
      query = query.eq('materia', materia)
    }

    const { data: questoes, error } = await query

    if (error) throw error

    // Embaralhar e pegar quantidade solicitada
    const questoesEmbaralhadas = questoes
      .sort(() => Math.random() - 0.5)
      .slice(0, parseInt(quantidade))

    res.status(200).json(questoesEmbaralhadas)
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    res.status(500).json({ error: 'Erro ao buscar questões' })
  }
}
