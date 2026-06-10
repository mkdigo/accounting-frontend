import { Link } from 'react-router';

import { NotFoundSvg } from '../../components/svgs/NotFoundSvg';

import './styles.css';

export function NotFound() {
  return (
    <main className='notFoundContainer'>
      <h1>Pagina não encontrada!</h1>
      <Link to='/'>Voltar para home.</Link>
      <NotFoundSvg />
    </main>
  );
}
