import { comparePasswords } from '../../lib/auth';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, senha } = req.body;

    // Aqui você deve verificar se o email e a senha fornecidos são válidos.
    // Por exemplo, você pode consultar o seu banco de dados para verificar se o email existe e se a senha está correta.

    const isPasswordValid = await comparePasswords(
      senha,
      // Substitua esta string pelo hash seguro da senha correspondente ao email fornecido.
      '$2a$10$E0xy8/V7ZaAZvCfPN9X0j.zC2DROyfjoetP2F7g3oqOhaH7s0DBZW',
    );

    if (isPasswordValid) {
      const token = generateToken({ username });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
};
