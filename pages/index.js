import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <>
      <Head>
        <title>Sistema PPL-A ANAC - Estude para sua licença</title>
        <meta name="description" content="Sistema completo de estudos para PPL-A ANAC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="card max-w-4xl w-full text-center">
          <h1 className="text-5xl font-bold text-aviation-blue mb-4">
            ✈️ PPL-A ANAC
          </h1>
          <h2 className="text-2xl text-gray-700 mb-8">
            Sistema Completo de Estudos
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-lg mb-2">4.485 Questões</h3>
              <p className="text-gray-600">Banco completo ANAC atualizado</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Estatísticas</h3>
              <p className="text-gray-600">Acompanhe seu progresso</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Simulados</h3>
              <p className="text-gray-600">Prepare-se para a prova</p>
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              <p className="text-xl text-gray-700">
                Olá, <strong>{user.nome}</strong>! 👋
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  Acessar Sistema 🚀
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    setUser(null)
                  }}
                  className="btn bg-gray-500 text-white text-lg px-8 py-4 hover:bg-gray-600"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => router.push('/login')}
                className="btn btn-primary text-lg px-8 py-4"
              >
                Entrar 🔐
              </button>
              <button
                onClick={() => router.push('/cadastro')}
                className="btn btn-success text-lg px-8 py-4"
              >
                Cadastrar-se ✨
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Desenvolvido para estudantes PPL-A 🛩️
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
