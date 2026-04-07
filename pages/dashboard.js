import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Dashboard() {
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
    setUser(parsedUser)

    // Buscar estatísticas
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
        <title>Dashboard - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-aviation-blue">
                  Olá, {user?.nome}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Bem-vindo ao seu painel de estudos
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-blue-50">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-aviation-blue">
                {stats?.totalRespondidas || 0}
              </div>
              <div className="text-gray-600">Questões Respondidas</div>
            </div>

            <div className="card bg-green-50">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {stats?.acertos || 0}
              </div>
              <div className="text-gray-600">Acertos</div>
            </div>

            <div className="card bg-red-50">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-2xl font-bold text-red-600">
                {stats?.erros || 0}
              </div>
              <div className="text-gray-600">Erros</div>
            </div>

            <div className="card bg-purple-50">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.percentual || 0}%
              </div>
              <div className="text-gray-600">Aproveitamento</div>
            </div>
          </div>

          {/* Barra de Progresso */}
          {stats && stats.totalRespondidas > 0 && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-3">Seu Progresso</h2>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(stats.totalRespondidas / 4485) * 100}%` }}
                />
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {stats.totalRespondidas} de 4.485 questões respondidas 
                ({((stats.totalRespondidas / 4485) * 100).toFixed(1)}%)
              </p>
            </div>
          )}

          {/* Menu de Ações */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/estudar')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Estudar
              </h3>
              <p className="text-gray-600">
                Responda questões por matéria ou aleatoriamente
              </p>
            </button>

            <button
              onClick={() => router.push('/simulado')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Simulado
              </h3>
              <p className="text-gray-600">
                Faça simulados completos como na prova real
              </p>
            </button>

            <button
              onClick={() => router.push('/estatisticas')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Estatísticas
              </h3>
              <p className="text-gray-600">
                Veja seu desempenho detalhado por matéria
              </p>
            </button>

            <button
              onClick={() => router.push('/revisao')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Revisar Erros
              </h3>
              <p className="text-gray-600">
                Revise questões que você errou
              </p>
            </button>

            <button
              onClick={() => router.push('/favoritas')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Favoritas
              </h3>
              <p className="text-gray-600">
                Acesse questões que você marcou
              </p>
            </button>

            <button
              onClick={() => router.push('/perfil')}
              className="card hover:shadow-xl cursor-pointer text-left"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-bold text-aviation-blue mb-2">
                Perfil
              </h3>
              <p className="text-gray-600">
                Edite seus dados e configurações
              </p>
            </button>
          </div>

          {/* Dica do Dia */}
          <div className="card mt-6 bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Dica do Dia</h3>
                <p className="text-gray-700">
                  Estude um pouco todos os dias! A consistência é mais importante 
                  que estudar muitas horas de uma vez. 15-30 minutos diários trazem 
                  resultados incríveis! ✈️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
