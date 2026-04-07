import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Cadastro() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha
        })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (err) {
      setError('Erro ao conectar com servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Cadastro - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-aviation-blue mb-2">
            ✨ Criar Conta
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Comece a estudar para sua licença PPL-A
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                className="input"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Senha
              </label>
              <input
                type="password"
                className="input"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                className="input"
                placeholder="Digite a senha novamente"
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-full text-lg"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta 🚀'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem conta?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-aviation-blue font-semibold hover:underline"
              >
                Faça login aqui
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Voltar para início
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
