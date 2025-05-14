import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;
  console.log(token);

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 });
  }

  try {
    const res = await axios.get('http://localhost:8080/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
}
