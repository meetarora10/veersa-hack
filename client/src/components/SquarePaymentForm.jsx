import { useEffect, useRef, useState } from "react";

const SQUARE_APP_ID = "sandbox-sq0idb-fG-d_cY-8ky8uunnqT0Q8A";
const SQUARE_LOCATION_ID = "LY6DTB8DPG1GZ";

export default function SquarePaymentForm({ amount, onSuccess, onError, disabled }) {
  const paymentsRef = useRef(null);
  const cardInstanceRef = useRef(null);
  const googlePayRef = useRef(null);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
      const canUseGooglePay = await payments.canUse("googlePay");
      if (!canUseGooglePay) {
        console.log("Google Pay not available");
        setGooglePayAvailable(false);
        return;
      }
      setGooglePayAvailable(true);

      const paymentRequest = await payments.paymentRequest(buildPaymentRequest());
      const googlePay = await payments.googlePay(paymentRequest);
      
      const googlePayButton = document.getElementById("google-pay-button");
      if (googlePayButton) {
        await googlePay.attach("#google-pay-button", { 
          buttonColor: "default", 
          buttonType: "long" 
        });
        googlePayRef.current = googlePay;

        googlePayButton.onclick = async () => {
          try {
            const tokenResult = await googlePay.tokenize();
            if (tokenResult.status === "OK") {
              await processPayment(tokenResult.token);
            } else {
              onError("Google Pay payment failed.");
            }
          } catch (err) {
            console.error("Google Pay error:", err);
            onError("Google Pay error: " + (err.message || "Unknown error"));
          }
        };
      }
    } catch (error) {
      console.error("Google Pay initialization error:", error);
      setGooglePayAvailable(false);
    }
  }

  useEffect(() => {
    if (!window.Square || !amount || isInitialized) {
      return;
    }

    let isMounted = true;

    async function initializeSquare() {
      try {
        console.log("Initializing Square with:", { SQUARE_APP_ID, SQUARE_LOCATION_ID, amount });
        
        // Clean up containers before initializing
        const cardContainer = document.getElementById("card-container");
        const googlePayButton = document.getElementById("google-pay-button");
        
        if (cardContainer) cardContainer.innerHTML = "";
        if (googlePayButton) googlePayButton.innerHTML = "";

        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        paymentsRef.current = payments;

        // Initialize Card
        const card = await payments.card();
        if (cardContainer && isMounted) {
          await card.attach("#card-container");
          cardInstanceRef.current = card;
        }

        // Initialize Google Pay
        if (isMounted) {
          await initializeGooglePay(payments);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Square initialization error:", error);
        if (isMounted) {
          onError("Failed to load payment options: " + (error.message || "Unknown error"));
        }
      }
    }

    initializeSquare();

    return () => {
      isMounted = false;
      
      // Cleanup
      const cardContainer = document.getElementById("card-container");
      const googlePayButton = document.getElementById("google-pay-button");

      if (cardContainer) cardContainer.innerHTML = "";
      if (googlePayButton) googlePayButton.innerHTML = "";

      if (cardInstanceRef.current) {
        try {
          cardInstanceRef.current.destroy?.();
        } catch (e) {
          console.warn("Error destroying card instance:", e);
        }
      }

      if (googlePayRef.current) {
        try {
          googlePayRef.current.destroy?.();
        } catch (e) {
          console.warn("Error destroying google pay instance:", e);
        }
      }

      cardInstanceRef.current = null;
      googlePayRef.current = null;
      paymentsRef.current = null;
      setIsInitialized(false);
    };
  }, [amount, onError]); // Removed SQUARE constants from deps since they're static

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!cardInstanceRef.current) {
      onError("Card payment form is not ready.");
      return;
    }

    try {
      const result = await cardInstanceRef.current.tokenize();
      if (result.status !== "OK") {
        console.error("Card tokenization failed:", result);
        onError("Card payment failed: " + (result.errors?.[0]?.detail || "Unknown error"));
        return;
      }
      await processPayment(result.token);
    } catch (err) {
      console.error("Card processing error:", err);
      onError("Card processing error: " + (err.message || "Unknown error"));
    }
  };

  async function processPayment(token) {
    try {
      const res = await fetch("http://localhost:5000/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: token, amount }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        onError(data.error || "Payment failed.");
      }
    } catch (err) {
      console.error("Payment request error:", err);
      onError("Payment request failed: " + (err.message || "Network error"));
    }
  }

  return (
    <div className="space-y-4">
      {googlePayAvailable && (
        <div id="google-pay-button" className="mb-4 cursor-pointer" />
      )}
      
      <form onSubmit={handleCardPayment} className="space-y-4">
        <div id="card-container" className="mb-4" />
        <button
          type="submit"
          disabled={disabled || !isInitialized}
          className="w-full bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitialized ? `Pay ₹${amount}` : "Loading..."}
        </button>
      </form>
    </div>
  );
}