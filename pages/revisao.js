import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Revisao() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [questoesErradas, setQuestoesErradas] = useState([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
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
    buscarQuestoesErradas(parsedUser.id, token)
  }, [])

  const buscarQuestoesErradas = async (userId, token) => {
    try {
      const res = await fetch(`/api/questoes/erradas?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setQuestoesErradas(data)
      }
    } catch (err) {
      console.error('Erro ao buscar questões erradas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando questões...</div>
      </div>
    )
  }

  if (questoesErradas.length === 0) {
    return (
      <>
        <Head>
          <title>Revisar Erros - Sistema PPL-A ANAC</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Parabéns!</h2>
            <p className="text-xl text-gray-700 mb-6">
              Você ainda não tem questões erradas para revisar.
            </p>
            <p className="text-gray-600 mb-6">
              Continue estudando e, se errar alguma questão, ela aparecerá aqui para revisão!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  const questao = questoesErradas[questaoAtual]

  return (
    <>
      <Head>
        <title>Revisar Erros - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-aviation-blue">🔄 Revisar Erros</h1>
                <p className="text-gray-600">
                  Questão {questaoAtual + 1} de {questoesErradas.length}
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                ← Voltar
              </button>
            </div>
          </div>

          {/* Progresso */}
          <div className="card mb-6">
            <div className="progress-bar">
              <div 
                className="progress-fill bg-orange-500"
                style={{ width: `${((questaoAtual + 1) / questoesErradas.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Questão */}
          <div className="card mb-6">
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className="bg-aviation-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                {questao.materia}
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Questão Errada
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {questao.enunciado}
            </h2>

            {questao.imagem_url && (
              <img 
                src={questao.imagem_url} 
                alt="Imagem da questão" 
                className="max-w-full h-auto rounded-lg mb-6"
              />
            )}

            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opcao) => {
                const isCorrect = questao.resposta_correta === opcao
                const wasYourAnswer = questao.sua_resposta === opcao
                
                let className = 'p-4 border-2 rounded-lg '
                
                if (isCorrect) {
                  className += 'border-green-500 bg-green-50'
                } else if (wasYourAnswer) {
                  className += 'border-red-500 bg-red-50'
                } else {
                  className += 'border-gray-300'
                }

                return (
                  <div key={opcao} className={className}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <span className="font-bold text-lg mr-3">{opcao})</span>
                        <span className="flex-1">{questao[`opcao_${opcao.toLowerCase()}`]}</span>
                      </div>
                      <div className="ml-3 flex gap-2">
                        {isCorrect && <span className="text-2xl">✅</span>}
                        {wasYourAnswer && !isCorrect && <span className="text-2xl">❌</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sua resposta */}
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="font-bold text-red-600 mb-2">Sua resposta anterior:</h3>
              <p className="text-gray-700">
                Opção <strong>{questao.sua_resposta}</strong> - {questao[`opcao_${questao.sua_resposta.toLowerCase()}`]}
              </p>
            </div>

            {/* Resposta correta */}
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-bold text-green-600 mb-2">✅ Resposta correta:</h3>
              <p className="text-gray-700">
                Opção <strong>{questao.resposta_correta}</strong> - {questao[`opcao_${questao.resposta_correta.toLowerCase()}`]}
              </p>
            </div>

            {/* Explicação */}
            {questao.comentario && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-aviation-blue rounded">
                <h3 className="font-bold text-aviation-blue mb-2">💡 Explicação:</h3>
                <p className="text-gray-700">{questao.comentario}</p>
              </div>
            )}
          </div>

          {/* Navegação */}
          <div className="card">
            <div className="flex gap-4 justify-between flex-wrap">
              <button
                onClick={() => questaoAtual > 0 && setQuestaoAtual(questaoAtual - 1)}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
                disabled={questaoAtual === 0}
              >
                ← Anterior
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Progresso</div>
                <div className="text-xl font-bold text-aviation-blue">
                  {questaoAtual + 1} / {questoesErradas.length}
                </div>
              </div>

              {questaoAtual < questoesErradas.length - 1 ? (
                <button
                  onClick={() => setQuestaoAtual(questaoAtual + 1)}
                  className="btn btn-primary"
                >
                  Próxima →
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-success"
                >
                  Finalizar Revisão ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
