import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Estudar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [questoes, setQuestoes] = useState([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState(null)
  const [respondida, setRespondida] = useState(false)
  const [loading, setLoading] = useState(true)
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    buscarQuestoes(token)
  }, [])

  const buscarQuestoes = async (token) => {
    try {
      const res = await fetch('/api/questoes/random?quantidade=20', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setQuestoes(data)
      }
    } catch (err) {
      console.error('Erro ao buscar questões:', err)
    } finally {
      setLoading(false)
    }
  }

  const verificarResposta = async () => {
    if (respostaSelecionada === null) return

    const questao = questoes[questaoAtual]
    const correta = respostaSelecionada === questao.resposta_correta

    if (correta) {
      setAcertos(acertos + 1)
    } else {
      setErros(erros + 1)
    }

    // Salvar resposta na API
    const token = localStorage.getItem('token')
    await fetch('/api/questoes/responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        questao_id: questao.id,
        resposta_usuario: respostaSelecionada,
        correta
      })
    })

    setRespondida(true)
  }

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1)
      setRespostaSelecionada(null)
      setRespondida(false)
    } else {
      // Fim das questões
      alert(`Você terminou!\n\nAcertos: ${acertos}\nErros: ${erros}\nAproveitamento: ${Math.round((acertos / questoes.length) * 100)}%`)
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando questões...</div>
      </div>
    )
  }

  if (questoes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Nenhuma questão encontrada</h2>
          <p className="text-gray-600 mb-4">Não há questões cadastradas ainda.</p>
          <button onClick={() => router.push('/dashboard')} className="btn btn-primary">
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  const questao = questoes[questaoAtual]

  return (
    <>
      <Head>
        <title>Estudar - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-aviation-blue">📖 Modo Estudo</h1>
                <p className="text-gray-600">Questão {questaoAtual + 1} de {questoes.length}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{acertos}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{erros}</div>
                  <div className="text-sm text-gray-600">Erros</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progresso */}
          <div className="card mb-6">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((questaoAtual + 1) / questoes.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Questão */}
          <div className="card mb-6">
            <div className="mb-4">
              <span className="bg-aviation-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                {questao.materia}
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
                const isSelected = respostaSelecionada === opcao
                const isCorrect = questao.resposta_correta === opcao
                
                let className = 'p-4 border-2 rounded-lg cursor-pointer transition-all '
                
                if (!respondida) {
                  className += isSelected 
                    ? 'border-aviation-blue bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                } else {
                  if (isCorrect) {
                    className += 'border-green-500 bg-green-50'
                  } else if (isSelected && !isCorrect) {
                    className += 'border-red-500 bg-red-50'
                  } else {
                    className += 'border-gray-300'
                  }
                }

                return (
                  <div
                    key={opcao}
                    onClick={() => !respondida && setRespostaSelecionada(opcao)}
                    className={className}
                  >
                    <div className="flex items-start">
                      <span className="font-bold text-lg mr-3">{opcao})</span>
                      <span className="flex-1">{questao[`opcao_${opcao.toLowerCase()}`]}</span>
                      {respondida && isCorrect && <span className="text-2xl">✅</span>}
                      {respondida && isSelected && !isCorrect && <span className="text-2xl">❌</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {respondida && questao.comentario && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-aviation-blue rounded">
                <h3 className="font-bold text-aviation-blue mb-2">💡 Explicação:</h3>
                <p className="text-gray-700">{questao.comentario}</p>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="card">
            <div className="flex gap-4 justify-between flex-wrap">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                ← Voltar
              </button>

              {!respondida ? (
                <button
                  onClick={verificarResposta}
                  className="btn btn-primary"
                  disabled={respostaSelecionada === null}
                >
                  Verificar Resposta ✓
                </button>
              ) : (
                <button
                  onClick={proximaQuestao}
                  className="btn btn-success"
                >
                  Próxima Questão →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
