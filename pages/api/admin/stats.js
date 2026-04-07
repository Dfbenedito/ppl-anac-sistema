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
    
    if (decoded.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    // Buscar estatísticas gerais
    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('id')

    const { data: questoes } = await supabase
      .from('questoes')
      .select('id')

    const { data: respostas } = await supabase
      .from('respostas')
      .select('correta')

    const totalUsuarios = usuarios?.length || 0
    const totalQuestoes = questoes?.length || 0
    const totalRespostas = respostas?.length || 0
    const acertos = respostas?.filter(r => r.correta).length || 0
    const mediaAproveitamento = totalRespostas > 0
      ? Math.round((acertos / totalRespostas) * 100)
      : 0

    res.status(200).json({
      totalUsuarios,
      totalQuestoes,
      totalRespostas,
      mediaAproveitamento
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
}
