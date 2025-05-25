import {
  PaymentForm,
  CreditCard,
  GooglePay,
} from "react-square-web-payments-sdk";

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export default function SquarePaymentForm({ amount, onSuccess, onError, disabled }) {
  return (
    <PaymentForm
      applicationId={SQUARE_APP_ID}
      locationId={SQUARE_LOCATION_ID}
      cardTokenizeResponseReceived={async (token, buyer) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sourceId: token.token, amount }),
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
      }}
      createPaymentRequest={() => ({
        countryCode: "IN",
        currencyCode: "INR",
        total: {
          amount: amount.toString(),
          label: "Total",
        },
        requestBillingContact: true,
        requestShippingContact: false,
      })}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <GooglePay
        buttonColor="black"
        buttonType="long"
      />
      <div className="my-4" />
      <CreditCard
        buttonProps={{
          disabled,
          className:
            "w-full bg-green-600 text-white py-2 rounded font-semibold",
        }}
      />
    </PaymentForm>
  );
}