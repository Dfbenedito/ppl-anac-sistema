import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Favoritas() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [questoesFavoritas, setQuestoesFavoritas] = useState([])
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
    buscarFavoritas(parsedUser.id, token)
  }, [])

  const buscarFavoritas = async (userId, token) => {
    try {
      const res = await fetch(`/api/questoes/favoritas?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setQuestoesFavoritas(data)
      }
    } catch (err) {
      console.error('Erro ao buscar favoritas:', err)
    } finally {
      setLoading(false)
    }
  }

  const removerFavorita = async (questaoId) => {
    const token = localStorage.getItem('token')
    
    try {
      await fetch('/api/questoes/favoritar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          questao_id: questaoId,
          favorita: false
        })
      })

      // Atualizar lista
      setQuestoesFavoritas(questoesFavoritas.filter(q => q.id !== questaoId))
    } catch (err) {
      console.error('Erro ao remover favorita:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando favoritas...</div>
      </div>
    )
  }

  if (questoesFavoritas.length === 0) {
    return (
      <>
        <Head>
          <title>Favoritas - Sistema PPL-A ANAC</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-3xl font-bold text-aviation-blue mb-4">
              Nenhuma Favorita
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Você ainda não marcou nenhuma questão como favorita.
            </p>
            <p className="text-gray-600 mb-6">
              Durante os estudos, clique na estrela para adicionar questões importantes aqui!
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

  return (
    <>
      <Head>
        <title>Favoritas - Sistema PPL-A ANAC</title>
      </Head>

      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-aviation-blue">⭐ Questões Favoritas</h1>
                <p className="text-gray-600 mt-1">
                  {questoesFavoritas.length} {questoesFavoritas.length === 1 ? 'questão marcada' : 'questões marcadas'}
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

          {/* Lista de Questões */}
          <div className="space-y-6">
            {questoesFavoritas.map((questao, index) => (
              <div key={questao.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-aviation-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Questão {index + 1}
                    </span>
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {questao.materia}
                    </span>
                  </div>
                  <button
                    onClick={() => removerFavorita(questao.id)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title="Remover dos favoritos"
                  >
                    ⭐
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {questao.enunciado}
                </h3>

                {questao.imagem_url && (
                  <img 
                    src={questao.imagem_url} 
                    alt="Imagem da questão" 
                    className="max-w-full h-auto rounded-lg mb-4"
                  />
                )}

                <div className="space-y-2 mb-4">
                  {['A', 'B', 'C', 'D'].map((opcao) => {
                    const isCorrect = questao.resposta_correta === opcao

                    return (
                      <div
                        key={opcao}
                        className={`p-3 border-2 rounded-lg ${
                          isCorrect 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <span className="font-bold mr-3">{opcao})</span>
                            <span className="flex-1">{questao[`opcao_${opcao.toLowerCase()}`]}</span>
                          </div>
                          {isCorrect && <span className="text-2xl ml-2">✅</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {questao.comentario && (
                  <div className="p-4 bg-blue-50 border-l-4 border-aviation-blue rounded">
                    <h4 className="font-bold text-aviation-blue mb-2">💡 Explicação:</h4>
                    <p className="text-gray-700">{questao.comentario}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
