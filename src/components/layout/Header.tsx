import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function Header() {
  const { totalCount } = useCart();
  const { ids } = useWishlist();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand-mark">
          SANDLINE
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/catalog">
            Catalog
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/wishlist">
            Wishlist ({ids.length})
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/cart">
            Cart ({totalCount})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
