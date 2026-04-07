import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Simulado() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [questoes, setQuestoes] = useState([])
  const [respostas, setRespostas] = useState({})
  const [iniciado, setIniciado] = useState(false)
  const [finalizado, setFinalizado] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [tempoRestante, setTempoRestante] = useState(3600) // 60 minutos
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (iniciado && !finalizado && tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            finalizarSimulado()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [iniciado, finalizado, tempoRestante])

  const iniciarSimulado = async () => {
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/questoes/random?quantidade=60', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setQuestoes(data)
        setIniciado(true)
      }
    } catch (err) {
      console.error('Erro ao buscar questões:', err)
      alert('Erro ao carregar simulado')
    }
  }

  const selecionarResposta = (questaoId, opcao) => {
    setRespostas({
      ...respostas,
      [questaoId]: opcao
    })
  }

  const finalizarSimulado = async () => {
    let acertos = 0
    let erros = 0

    const token = localStorage.getItem('token')

    for (const questao of questoes) {
      const respostaUsuario = respostas[questao.id]
      const correta = respostaUsuario === questao.resposta_correta

      if (correta) acertos++
      else erros++

      // Salvar resposta
      await fetch('/api/questoes/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          questao_id: questao.id,
          resposta_usuario: respostaUsuario || '',
          correta
        })
      })
    }

    const total = questoes.length
    const percentual = Math.round((acertos / total) * 100)
    const aprovado = percentual >= 70

    setResultado({
      acertos,
      erros,
      total,
      percentual,
      aprovado,
      naoRespondidas: total - acertos - erros
    })

    setFinalizado(true)
  }

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    )
  }

  // Tela de resultado
  if (finalizado && resultado) {
    return (
      <>
        <Head>
          <title>Resultado do Simulado - Sistema PPL-A ANAC</title>
        </Head>

        <div className="min-h-screen p-4 flex items-center justify-center">
          <div className="card max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {resultado.aprovado ? '🎉' : '😔'}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {resultado.aprovado ? 'APROVADO!' : 'REPROVADO'}
              </h1>
              <p className="text-gray-600">
                {resultado.aprovado 
                  ? 'Parabéns! Você atingiu a nota mínima!' 
                  : 'Continue estudando, você vai conseguir!'}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-aviation-blue">
                  {resultado.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {resultado.acertos}
                </div>
                <div className="text-sm text-gray-600">Acertos</div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {resultado.erros}
                </div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>

              <div className="text-center p-4 border-t">
  <button onClick={proximaQuestao} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
    Próxima
  </button>
</div>

