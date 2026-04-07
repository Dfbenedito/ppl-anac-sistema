import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
  }

  try {
    // Verificar se email já existe
    const { data: existingUsers } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1)

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado' })
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // Criar usuário
    const { data: newUser, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nome,
          email: email.toLowerCase(),
          senha: senhaHash,
          tipo: 'aluno',
          data_cadastro: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, tipo: newUser.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retornar dados (sem senha)
    const { senha: _, ...userSemSenha } = newUser

    res.status(201).json({
      token,
      user: userSemSenha
    })
  } catch (error) {
    console.error('Erro no cadastro:', error)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
}
