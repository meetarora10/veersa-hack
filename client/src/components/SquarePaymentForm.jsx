import { useEffect, useRef, useState } from "react";

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export default function SquarePaymentForm({ amount, onSuccess, onError, disabled }) {
  const paymentsRef = useRef(null);
  const cardInstanceRef = useRef(null);
  const googlePayRef = useRef(null);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  function buildPaymentRequest() {
    return {
      countryCode: "IN",
      currencyCode: "INR",
      total: {
        amount: amount.toString(),
        label: "Total",
      },
    };
  }

  async function initializeGooglePay(payments) {
    try {
      // Check if Google Pay is available
      const canUseGooglePay = await payments.canUse("googlePay");
        if (!canUseGooglePay) {
            console.log("no");
        setGooglePayAvailable(false);
        return;
      }
      setGooglePayAvailable(true);

      const paymentRequest = await payments.paymentRequest(buildPaymentRequest());
      const googlePay = await payments.googlePay(paymentRequest);
      await googlePay.attach("#google-pay-button", { buttonColor: "default", buttonType: "long" });
      googlePayRef.current = googlePay;

      const googlePayButton = document.getElementById("google-pay-button");
      googlePayButton.onclick = async () => {
        try {
          const tokenResult = await googlePay.tokenize();
          if (tokenResult.status === "OK") {
            await processPayment(tokenResult.token);
          } else {
            onError("Google Pay payment failed.");
          }
        } catch (err) {
          onError("Google Pay error.");
        }
      };
    } catch (error) {
      setGooglePayAvailable(false);
    }
  }

  useEffect(() => {
    // Clean up containers before initializing
    document.getElementById("card-container")?.replaceChildren();
    document.getElementById("google-pay-button")?.replaceChildren();

    if (!window.Square || !amount) {
      return;
    }

    let isMounted = true;

    async function initializeSquare() {
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        paymentsRef.current = payments;

        // Card
        const card = await payments.card();
        await card.attach("#card-container");
        cardInstanceRef.current = card;

        // Google Pay
        await initializeGooglePay(payments);
      } catch (e) {
        if (isMounted) onError("Failed to load payment options.");
      }
    }

    initializeSquare();

    return () => {
      isMounted = false;
      document.getElementById("card-container")?.replaceChildren();
      document.getElementById("google-pay-button")?.replaceChildren();
    };
  }, [SQUARE_APP_ID, SQUARE_LOCATION_ID, amount]);

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!cardInstanceRef.current) {
      onError("Card payment form is not ready.");
      return;
    }

    try {
      const result = await cardInstanceRef.current.tokenize();
      if (result.status !== "OK") {
        onError("Card payment failed.");
        return;
      }
      await processPayment(result.token);
    } catch (err) {
      onError("Card processing error.");
    }
  };

  async function processPayment(token) {
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: token, amount }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        onError(data.error || "Payment failed.");
      }
    } catch (err) {
      onError("Payment request failed.");
    }
  }

  return (
    <form onSubmit={handleCardPayment} className="space-y-4">
      <div id="google-pay-button" className="mb-4 cursor-pointer" />
      <div id="card-container" className="mb-4" />
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-green-600 text-white py-2 rounded font-semibold"
      >
        Pay ₹{amount}
      </button>
    </form>
  );
}