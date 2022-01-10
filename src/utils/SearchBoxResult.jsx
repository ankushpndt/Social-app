import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

export const SearchBoxResult = ({ user, setToggleDropbox }) => {
  const { userid } = useSelector((state) => state.auth.login);

  return (
    <Link
      to={user._id === userid ? '/user' : `/user/${user._id}`}
      onClick={setToggleDropbox ? () => setToggleDropbox(false) : () => {}}
      className='searchBox__result'
    >
      <div className='avatar'>
        <img className='avatar__img' src={user.image} alt='avatar' />
      </div>
      <div className='result__content'>
        <h5 className='username'>{user.name}</h5>
      </div>
    </Link>
  );
};