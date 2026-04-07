import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { nome, email, senhaAtual, novaSenha } = req.body

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' })
    }

    // Buscar usuário atual
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', decoded.id)
      .single()

    if (userError || !userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Se está alterando senha, validar senha atual
    if (novaSenha) {
      if (!senhaAtual) {
        return res.status(400).json({ error: 'Senha atual é obrigatória para alterar a senha' })
      }

      const senhaValida = await bcrypt.compare(senhaAtual, userData.senha)
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' })
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' })
      }
    }

    // Verificar se o novo email já está em uso (se mudou)
    if (email.toLowerCase() !== userData.email.toLowerCase()) {
      const { data: emailExists } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email.toLowerCase())
        .neq('id', decoded.id)
        .limit(1)

      if (emailExists && emailExists.length > 0) {
        return res.status(400).json({ error: 'Este email já está em uso' })
      }
    }

    // Preparar dados para atualização
    const updateData = {
      nome,
      email: email.toLowerCase()
    }

    // Se está alterando senha, criptografar
    if (novaSenha) {
      updateData.senha = await bcrypt.hash(novaSenha, 10)
    }

    // Atualizar usuário
    const { data: updatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', decoded.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Remover senha da resposta
    const { senha: _, ...userSemSenha } = updatedUser

    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      user: userSemSenha
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }
}
