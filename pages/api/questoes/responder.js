import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { questao_id, resposta_usuario, correta } = req.body

    if (!questao_id || resposta_usuario === undefined) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    // Salvar resposta
    const { data, error } = await supabase
      .from('respostas')
      .insert([
        {
          usuario_id: decoded.id,
          questao_id,
          resposta_usuario,
          correta,
          data_resposta: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    res.status(500).json({ error: 'Erro ao salvar resposta' })
  }
}
