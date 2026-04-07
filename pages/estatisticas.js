import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Estatisticas() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando estatísticas...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Estatísticas - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-aviation-blue">📊 Suas Estatísticas</h1>
                <p className="text-gray-600 mt-1">Acompanhe seu desempenho detalhado</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                ← Voltar
              </button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-blue-50">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-3xl font-bold text-aviation-blue">
                {stats?.totalRespondidas || 0}
              </div>
              <div className="text-gray-600">Questões Respondidas</div>
              <div className="text-sm text-gray-500 mt-2">
                {((stats?.totalRespondidas || 0) / 4485 * 100).toFixed(1)}% do total
              </div>
            </div>

            <div className="card bg-green-50">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-600">
                {stats?.acertos || 0}
              </div>
              <div className="text-gray-600">Acertos</div>
              <div className="text-sm text-gray-500 mt-2">
                Continue assim! 👏
              </div>
            </div>

            <div className="card bg-red-50">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-3xl font-bold text-red-600">
                {stats?.erros || 0}
              </div>
              <div className="text-gray-600">Erros</div>
              <div className="text-sm text-gray-500 mt-2">
                Aprenda com eles 💪
              </div>
            </div>

            <div className={`card ${(stats?.percentual || 0) >= 70 ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="text-3xl mb-2">📈</div>
              <div className={`text-3xl font-bold ${(stats?.percentual || 0) >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {stats?.percentual || 0}%
              </div>
              <div className="text-gray-600">Aproveitamento</div>
              <div className="text-sm text-gray-500 mt-2">
                {(stats?.percentual || 0) >= 70 ? 'Aprovado!' : 'Quase lá!'}
              </div>
            </div>
          </div>

          {/* Progresso Geral */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-aviation-blue mb-4">Progresso Geral</h2>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Banco de Questões</span>
                <span className="font-bold">{stats?.totalRespondidas || 0} / 4.485</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((stats?.totalRespondidas || 0) / 4485) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Taxa de Acerto</span>
                <span className="font-bold">{stats?.percentual || 0}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${(stats?.percentual || 0) >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${stats?.percentual || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metas */}
          <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">🎯 Suas Metas</h2>

