import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setNome(parsedUser.nome)
    setEmail(parsedUser.email)
    
    fetchStats(parsedUser.id, token)
  }, [])

  const fetchStats = async (userId, token) => {
    try {
      const res = await fetch(`/api/user/stats?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const salvarPerfil = async (e) => {
    e.preventDefault()
    setMensagem('')

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/user/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          email,
          senhaAtual: senhaAtual || undefined,
          novaSenha: novaSenha || undefined
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Atualizar localStorage
        const updatedUser = { ...user, nome, email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        setMensagem('✅ Perfil atualizado com sucesso!')
        setEditando(false)
        setSenhaAtual('')
        setNovaSenha('')
        
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setMensagem(`❌ ${data.error}`)
      }
    } catch (err) {
      setMensagem('❌ Erro ao atualizar perfil')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando perfil...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Meu Perfil - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-aviation-blue">👤 Meu Perfil</h1>
                <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                ← Voltar
              </button>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card bg-blue-50 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-aviation-blue">
                {stats?.totalRespondidas || 0}
              </div>
              <div className="text-gray-600 text-sm">Questões Respondidas</div>
            </div>

            <div className="card bg-green-50 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {stats?.acertos || 0}
              </div>
              <div className="text-gray-600 text-sm">Acertos</div>
            </div>

            <div className="card bg-purple-50 text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.percentual || 0}%
              </div>
              <div className="text-gray-600 text-sm">Aproveitamento</div>
            </div>
          </div>

          {/* Informações do Usuário */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-aviation-blue">Informações Pessoais</h2>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="btn btn-primary"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {mensagem && (
              <div className={`p-4 rounded-lg mb-4 ${
                mensagem.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {mensagem}
              </div>
            )}

            {!editando ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nome</label>
                  <div className="text-lg text-gray-800 mt-1">{user?.nome}</div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <div className="text-lg text-gray-800 mt-1">{user?.email}</div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Tipo de Conta</label>
                  <div className="text-lg text-gray-800 mt-1 capitalize">
                    {user?.tipo === 'admin' ? '👑 Administrador' : '👨‍🎓 Aluno'}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Membro desde</label>
                  <div className="text-lg text-gray-800 mt-1">
                    {user?.data_cadastro ? new Date(user.data_cadastro).toLocaleDateString('pt-BR') : 'Data não disponível'}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={salvarPerfil} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <h3 className="font-bold text-lg mb-3">Alterar Senha (opcional)</h3>
                  
                  <div className="mb-3">
                    <label className="text-sm font-semibold text-gray-600">Senha Atual</label>
                    <input
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="input-field mt-1"
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Nova Senha</label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="input-field mt-1"
                      placeholder="Digite a nova senha (mín. 6 caracteres)"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-success flex-1">
                    💾 Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(false)
                      setNome(user.nome)
                      setEmail(user.email)
                      setSenhaAtual('')
                      setNovaSenha('')
                      setMensagem('')
                    }}
                    className="btn bg-gray-500 text-white hover:bg-gray-600 flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Ações da Conta */}
          <div className="card bg-red-50 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Zona de Perigo</h2>
            <p className="text-gray-700 mb-4">
              Ao sair, você precisará fazer login novamente para acessar sua conta.
            </p>
            <button
              onClick={logout}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              🚪 Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
