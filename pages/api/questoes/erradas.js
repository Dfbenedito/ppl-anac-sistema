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

    // Buscar respostas erradas
    const { data: respostasErradas, error: respostasError } = await supabase
      .from('respostas')
      .select('questao_id, resposta_usuario')
      .eq('usuario_id', userId)
      .eq('correta', false)

    if (respostasError) throw respostasError

    if (!respostasErradas || respostasErradas.length === 0) {
      return res.status(200).json([])
    }

    // Buscar as questões correspondentes
    const questoesIds = respostasErradas.map(r => r.questao_id)
    
    
