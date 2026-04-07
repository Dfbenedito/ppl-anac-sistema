import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Estatisticas() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [estatisticas, setEstatisticas] = useState({
    totalQuestoes: 0,
    acertos: 0,
    erros: 0,
    percentualAcerto: 0,
    tempoMedioResposta: 0,
    questoesPorCategoria: {
      'Regulamentação': { total: 0, acertos: 0 },
      'Conhecimentos Técnicos': { total: 0, acertos: 0 },
      'Meteorologia': { total: 0, acertos: 0 }
    },
    ultimosSimulados: [],
    horasEstudo: 0,
    metaSemanal: 100,
    progressoSemanal: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const dadosUsuario = localStorage.getItem('usuario')
    if (dadosUsuario) {
      const user = JSON.parse(dadosUsuario)
      setUsuario(user)
      carregarEstatisticas(user.id)
    }
  }, [router])

  const carregarEstatisticas = async (userId) => {
    // Simular carregamento de estatísticas
    // Em produção, isso viria de uma API
    setTimeout(() => {
      setEstatisticas({
        totalQuestoes: 450,
        acertos: 315,
        erros: 135,
        percentualAcerto: 70,
        tempoMedioResposta: 45,
        questoesPorCategoria: {
          'Regulamentação': { total: 150, acertos: 105 },
          'Conhecimentos Técnicos': { total: 150, acertos: 108 },
          'Meteorologia': { total: 150, acertos: 102 }
        },
        ultimosSimulados: [
          { data: '2024-01-15', acertos: 45, total: 60, percentual: 75 },
          { data: '2024-01-12', acertos: 42, total: 60, percentual: 70 },
          { data: '2024-01-10', acertos: 38, total: 60, percentual: 63 }
        ],
        horasEstudo: 24,
        metaSemanal: 100,
        progressoSemanal: 75
      })
    }, 500)
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📊 Estatísticas</h1>
              <p className="text-gray-600 mt-1">Acompanhe seu progresso nos estudos</p>
            </div>
            <button
              onClick={() => router.push('/painel')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              ← Voltar ao Painel
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Questões</p>
                <p className="text-3xl font-bold text-blue-600">{estatisticas.totalQuestoes}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taxa de Acerto</p>
                <p className="text-3xl font-bold text-green-600">{estatisticas.percentualAcerto}%</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Horas de Estudo</p>
                <p className="text-3xl font-bold text-purple-600">{estatisticas.horasEstudo}h</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <span className="text-3xl">⏱️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tempo Médio</p>
                <p className="text-3xl font-bold text-orange-600">{estatisticas.tempoMedioResposta}s</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <span className="text-3xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Desempenho Geral */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Desempenho Geral</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Acertos</span>
                  <span className="text-green-600 font-bold">{estatisticas.acertos}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{width: `${(estatisticas.acertos / estatisticas.totalQuestoes) * 100}%`}}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Erros</span>
                  <span className="text-red-600 font-bold">{estatisticas.erros}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{width: `${(estatisticas.erros / estatisticas.totalQuestoes) * 100}%`}}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {estatisticas.percentualAcerto}%
                  </div>
                  <div className="text-gray-600">Taxa de Aproveitamento</div>
                  <div className="mt-3">
                    {estatisticas.percentualAcerto >= 70 ? (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                        ✅ Acima da média de aprovação
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                        ⚠️ Continue estudando para atingir 70%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desempenho por Categoria */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Por Categoria</h2>
            
            <div className="space-y-6">
              {Object.entries(estatisticas.questoesPorCategoria).map(([categoria, dados]) => {
                const percentual = dados.total > 0 ? ((dados.acertos / dados.total) * 100).toFixed(1) : 0
                return (
                  <div key={categoria}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">{categoria}</span>
                      <span className="text-gray-600">{dados.acertos}/{dados.total} ({percentual}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                          parseFloat(percentual) >= 70 ? 'bg-green-500' : 
                          parseFloat(percentual) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{width: `${percentual}%`}}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Foque mais em categorias com percentual abaixo de 70%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metas e Últimos Simulados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Metas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Suas Metas</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Meta Semanal</span>
                <span className="text-blue-600 font-bold">{estatisticas.progressoSemanal}/{estatisticas.metaSemanal} questões</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                  style={{width: `${(estatisticas.progressoSemanal / estatisticas.metaSemanal) * 100}%`}}
                >
                  {((estatisticas.progressoSemanal / estatisticas.metaSemanal) * 100).toFixed(0)}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Faltam {estatisticas.metaSemanal - estatisticas.progressoSemanal} questões para atingir sua meta
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">📅 Plano de Estudos Recomendado</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• Segunda a Sexta: 20 questões/dia</li>
                <li>• Sábado: 1 simulado completo (60 questões)</li>
                <li>• Domingo: Revisão das questões erradas</li>
              </ul>
            </div>
          </div>

          {/* Últimos Simulados */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Últimos Simulados</h2>
            
            <div className="space-y-4">
              {estatisticas.ultimosSimulados.map((simulado, index) => (
                <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">
                      {new Date(simulado.data).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`font-bold ${
                      simulado.percentual >= 70 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {simulado.percentual}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {simulado.acertos}/{simulado.total} questões corretas
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        simulado.percentual >= 70 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{width: `${simulado.percentual}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {estatisticas.ultimosSimulados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-5xl mb-4">📋</p>
                <p>Nenhum simulado realizado ainda</p>
                <button
                  onClick={() => router.push('/simulado')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Fazer Primeiro Simulado
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Evolução do Desempenho</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">Gráfico de evolução será implementado em breve</p>
            <p className="text-5xl">📈</p>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/simulado')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition shadow-lg"
          >
            🚀 Fazer Novo Simulado
          </button>
        </div>
      </div>
    </div>
  )
}
