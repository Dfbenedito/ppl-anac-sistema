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
    const { questao_id, favorita } = req.body

    if (!questao_id) {
      return res.status(400).json({ error: 'ID da questão é obrigatório' })
    }

    if (favorita) {
      // Adicionar aos favoritos
      const { data, error } = await supabase
        .from('favoritas')
        .insert([
          {
            usuario_id: decoded.id,
            questao_id,
            data_favoritada: new Date().toISOString()
          }
        ])
        .select()

      if (error) throw error
      res.status(201).json({ message: 'Adicionada aos favoritos', data })
    } else {
      // Remover dos favoritos
      const { error } = await supabase
        .from('favoritas')
        .delete()
        .eq('usuario_id', decoded.id)
        .eq('questao_id', questao_id)

      if (error) throw error
      res.status(200).json({ message: 'Removida dos favoritos' })
    }
  } catch (error) {
    console.error('Erro ao favoritar:', error)
    res.status(500).json({ error: 'Erro ao favoritar questão' })
  }
}

