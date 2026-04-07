import { connectToDatabase } from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { db } = await connectToDatabase()
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'userId é obrigatório' })
    }

    // Buscar questões erradas do usuário
    const questoesErradas = await db
      .collection('respostas')
      .find({ 
        userId: userId,
        correta: false 
      })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    res.status(200).json({ questoesErradas })
  } catch (error) {
    console.error('Erro ao buscar questões erradas:', error)
    res.status(500).json({ message: 'Erro ao buscar questões erradas' })
  }
}
