import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Admin() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    if (parsedUser.tipo !== 'admin') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    fetchAdminStats(token)
  }, [])

  const fetchAdminStats = async (token) => {
    try {
      const res = await fetch('/api/admin/stats', {
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

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-aviation-blue">
                  🔧 Painel Administrativo
                </h1>
                <p className="text-gray-600 mt-1">
                  Olá, {user?.nome} - Administrador
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn bg-gray-500 text-white hover:bg-gray-600"
                >
                  Ver como Aluno
                </button>
                <button
                  onClick={handleLogout}
                  className="btn bg-gray-700 text-white hover:bg-gray-800"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas Gerais */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-blue-50">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-aviation-blue">
                {stats?.totalUsuarios || 0}
              </div>
              <div className="text-gray-600">Usuários Cadastrados</div>
            </div>

            <div className="card bg-green-50">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-green-600">
                {stats?.totalQuestoes || 0}
              </div>
              <div className="text-gray-600">Questões no Banco</div>
            </div>

            <div className="card bg-purple-50">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.totalRespostas || 0}
              </div>
              <div className="text-gray-600">Respostas Totais</div>
            </div>

            <div className="card bg-yellow-50">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.mediaAproveitamento || 0}%
              </div>
              <div className="text-gray-600">Média Geral</div>
            </div>
          </div>

          {/* Menu Administrativo */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/questoes')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Gerenciar Questões
              </h3>
              <p className="text-gray-600">
                Adicionar, editar ou remover questões
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/usuarios')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Gerenciar Usuários
              </h3>
              <p className="text-gray-600">
                Ver e gerenciar contas de usuários
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/import')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">📥</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Importar Questões
              </h3>
              <p className="text-gray-600">
                Importar questões via Excel/CSV
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/relatorios')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Relatórios
              </h3>
              <p className="text-gray-600">
                Visualize estatísticas detalhadas
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/backup')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">💾</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Backup
              </h3>
              <p className="text-gray-600">
                Fazer backup do banco de dados
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/configuracoes')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Configurações
              </h3>
              <p className="text-gray-600">
                Ajustes gerais do sistema
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
