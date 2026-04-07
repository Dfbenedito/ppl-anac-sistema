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

  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  try {
    // Buscar usuário
    const { data: users, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1)

    if (error) throw error

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    const user = users[0]

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha)

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retornar dados (sem senha)
    const { senha: _, ...userSemSenha } = user

    res.status(200).json({
      token,
      user: userSemSenha
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}
