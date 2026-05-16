import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import { useCart } from '../hooks/useCart';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Cart"
        title="Your selected pieces"
        description="Adjust quantities before heading to checkout."
      />

      {items.length === 0 ? (
        <section className="empty-state">
          <p>Your cart is currently empty.</p>
          <Link to="/catalog" className="hero-link">
            Continue shopping
          </Link>
        </section>
      ) : (
        <section className="cart-layout">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-row">
                <img src={item.image} alt={item.title} />
                <div className="cart-row-meta">
                  <h3>{item.title}</h3>
                  <p>₹{item.price}</p>
                  <div className="qty-controls">
                    <Button
                      variant="ghost"
                      onClick={() => updateQuantity(String(item.id), item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="ghost"
                      onClick={() => updateQuantity(String(item.id), item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="remove-btn"
                  onClick={() => removeItem(String(item.id))}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <aside className="cart-summary">
            <h3>Summary</h3>
            <p>
              Subtotal <span>₹{subtotal}</span>
            </p>
            <Link to="/checkout" className="btn-link">
              Proceed to checkout
            </Link>
          </aside>
        </section>
      )}
    </div>
  );
}