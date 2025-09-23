import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export async function getServerSideProps() {
    const token = Cookies.get('access_token');

  if (!token) redirect('/auth/login')

  return {
    props: {} // props da sua página protegida
  };
}
