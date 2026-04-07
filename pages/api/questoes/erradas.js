export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'userId é obrigatório' })
    }

    // TODO: Implementar busca de questões erradas quando houver banco de dados
    // Por enquanto, retorna array vazio
    const questoesErradas = []

    res.status(200).json({ questoesErradas })
  } catch (error) {
    console.error('Erro ao buscar questões erradas:', error)
    res.status(500).json({ message: 'Erro ao buscar questões erradas' })
  }
}
