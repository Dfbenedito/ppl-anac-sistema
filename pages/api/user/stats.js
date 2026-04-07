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
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = req.query.userId || decoded.id

    // Buscar respostas do usuário
    const { data: respostas, error } = await supabase
      .from('respostas')
      .select('correta')
      .eq('usuario_id', userId)

    if (error) throw error

    const totalRespondidas = respostas.length
    const acertos = respostas.filter(r => r.correta).length
    const erros = totalRespondidas - acertos
    const percentual = totalRespondidas > 0 
      ? Math.round((acertos / totalRespondidas) * 100) 
      : 0

    res.status(200).json({
      totalRespondidas,
      acertos,
      erros,
      percentual
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
}
