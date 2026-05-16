import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import { useCart } from '../hooks/useCart';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  
  // Customer Information States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState('');

  // Update order details whenever cart changes
  useEffect(() => {
    const details = `
      <p><b>Order Details:</b></p>
      <p><b>Order ID:</b> #${Date.now()}</p>
      <p><b>Items:</b></p>
      <ul>
        ${items.map(item => `<li>${item.title} - ${item.quantity}x ₹${item.price}</li>`).join('')}
      </ul>
      <p><b>Subtotal:</b> ₹${subtotal}</p>
      <p><b>Customer Name:</b> ${firstName} ${lastName}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Address:</b> ${address}, ${city} - ${postalCode}</p>
    `;
    setOrderDetails(details);
  }, [items, subtotal, firstName, lastName, phone, address, city, postalCode]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const generateOrderPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 10;

    // Title
    doc.setFontSize(16);
    doc.text('ORDER CONFIRMATION', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.text(`Order ID: #${Date.now()}`, 10, yPosition);
    
    // Customer Info
    yPosition += 10;
    doc.setFontSize(11);
    doc.text('Customer Information:', 10, yPosition);
    yPosition += 7;
    doc.setFontSize(9);
    doc.text(`Name: ${firstName} ${lastName}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Email: ${email}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Phone: ${phone}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Address: ${address}`, 10, yPosition);
    yPosition += 5;
    doc.text(`${city} - ${postalCode}`, 10, yPosition);

    // Items
    yPosition += 10;
    doc.setFontSize(11);
    doc.text('Order Items:', 10, yPosition);
    yPosition += 7;
    doc.setFontSize(9);
    
    items.forEach((item) => {
      doc.text(`${item.title} - Qty: ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}`, 10, yPosition);
      yPosition += 5;
    });

    // Total
    yPosition += 5;
    doc.setFontSize(11);
    doc.text(`Total Amount: ₹${subtotal}`, 10, yPosition);
    
    yPosition += 10;
    doc.setFontSize(9);
    doc.text('Thank you for your purchase!', 10, yPosition);
    doc.text('We will notify you once your order ships.', 10, yPosition + 5);

    return doc;
  };

  const sendEmailWithAttachment = async (pdfDoc: jsPDF) => {
    try {
      const base64Pdf = pdfDoc.output('datauristring').split(',')[1];
      const workerUrl = import.meta.env.VITE_CLOUDFLARE_WORKER_URL?.trim();

      if (!workerUrl) {
        throw new Error('VITE_CLOUDFLARE_WORKER_URL is not configured');
      }
      
      const emailPayload = {
        sender: {
          name: 'Modern E-Commerce',
          email: 'noreply@modernecommerce.com'
        },
        to: [
          {
            name: `${firstName} ${lastName}`,
            email: email
          }
        ],
        subject: `Order Confirmation - Order #${Date.now()}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Order Confirmation</h2>
            <p>Dear ${firstName},</p>
            <p>Thank you for your purchase! Here are your order details:</p>
            ${orderDetails}
            <p style="margin-top: 20px;">We will notify you once your order ships.</p>
            <p>Best regards,<br/>Modern E-Commerce Team</p>
          </div>
        `,
        attachment: [
          {
            content: base64Pdf,
            name: `order-${Date.now()}.pdf`
          }
        ]
      };

      // Send to Cloudflare Worker endpoint
      const response = await axios.post(
        workerUrl,
        emailPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Email sent successfully:', response.data);
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error?.response?.status, error?.response?.data ?? error?.message ?? error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || 
        !address.trim() || !city.trim() || !postalCode.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!validatePhone(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const pdfDoc = generateOrderPDF();
      await sendEmailWithAttachment(pdfDoc);
      
      alert('Your order has been placed successfully! Confirmation email sent.');
      clearCart();
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      
      navigate('/');
    } catch (error) {
      alert('Error placing order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Checkout"
        title="Final review"
        description="Confirm your selections and place your order."
      />

      <section className="checkout-layout">
        <ul className="checkout-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.title}</span>
              <span>
                {item.quantity} x ₹{item.price}
              </span>
            </li>
          ))}
          {items.length === 0 ? <li>No items in cart.</li> : null}
        </ul>

        <div className="checkout-card">
          <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
            <h3>Shipping Information</h3>
            
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your street address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code *</label>
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                required
              />
            </div>

            <p className="order-summary">
              Total <span>₹{subtotal}</span>
            </p>
            <Button 
              disabled={items.length === 0 || loading}
              type="submit"
            >
              {loading ? 'Processing...' : 'Place order'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
