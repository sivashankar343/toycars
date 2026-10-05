import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types/vehicle';
import { ToyVehicleRenderer } from './ToyVehicleRenderer';
import { soundEngine } from '../utils/soundEngine';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  const [shippingForm, setShippingForm] = useState({
    name: 'Alex Mercer',
    email: 'alex.collector@apexspeed.com',
    address: '742 Evergreen St, Bay 4',
    city: 'Speedway City',
    postalCode: '90210'
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.vehicle.price * item.quantity, 0);
  const shippingFee = subtotal > 35 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    soundEngine.unboxCelebration();

    setTimeout(() => {
      setOrderId(`APX-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1200);
  };

  const handleClose = () => {
    soundEngine.clickSwitch();
    setOrderComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Toy Collector Bag ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {orderComplete ? (
            /* Order Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-display">
                  Order Confirmed & Boxed!
                </h3>
                <p className="text-xs text-neutral-400">
                  Receipt Ref: <span className="text-amber-400 font-mono font-bold">{orderId}</span>
                </p>
              </div>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Your scale toy vehicles and track hardware are being prepared in our collector foam packaging. Delivery dispatched to {shippingForm.address}.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors shadow-sm"
                >
                  Return to Toy Showroom
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart State */
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-base font-bold text-neutral-300 font-display">Your toy bag is currently empty</p>
              <p className="text-xs text-neutral-500">Explore the showroom to add die-cast cars, monster trucks, or track booster packs.</p>
              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            /* Cart Items List & Summary */
            <div className="space-y-6">
              {/* Item Rows */}
              <div className="divide-y divide-neutral-800/80">
                {cart.map((item) => (
                  <div key={item.vehicle.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Vehicle Mini Thumb */}
                      <div className="w-20 h-16 rounded-xl bg-neutral-950 border border-neutral-800 p-2 flex items-center justify-center shrink-0">
                        <ToyVehicleRenderer vehicle={item.vehicle} size="sm" />
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-white">{item.vehicle.name}</h4>
                        <div className="text-[11px] text-neutral-400">
                          <span>{item.vehicle.scale} Scale</span> · <span className="capitalize">{item.vehicle.category.replace('-', ' ')}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                          ${item.vehicle.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-950 p-1">
                        <button
                          onClick={() => {
                            soundEngine.clickSwitch();
                            onUpdateQuantity(item.vehicle.id, -1);
                          }}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white tabular-nums font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            soundEngine.clickSwitch();
                            onUpdateQuantity(item.vehicle.id, 1);
                          }}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.clickSwitch();
                          onRemoveItem(item.vehicle.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Information Form */}
              <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-neutral-800">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Collector Shipping Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-neutral-400 block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Track Express Shipping</span>
                    <span className="text-white font-mono tabular-nums">
                      {shippingFee === 0 ? 'FREE (Over $35)' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total Amount</span>
                    <span className="text-amber-400 font-mono tabular-nums text-base">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Checkout */}
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/10"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isCheckingOut ? 'Processing Order...' : `Complete Order · $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
