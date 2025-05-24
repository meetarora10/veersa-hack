from flask import Blueprint, request, jsonify
from square import Square
from square.core.api_error import ApiError
from square.environment import SquareEnvironment
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

payment_bp = Blueprint('payment', __name__)

client = Square(
    token=os.getenv("SQUARE_ACCESS_TOKEN"),
    environment=SquareEnvironment.SANDBOX
)

@payment_bp.route("/api/pay", methods=["POST"])
def pay():
    data = request.get_json()
    source_id = data.get("sourceId")
    amount = data.get("amount")
    
    locations = client.locations.list()
    print("Available locations for this token:")
    print(locations.locations)

    if not source_id or not amount:
        return jsonify({"success": False, "error": "Missing sourceId or amount"}), 400

    try:
        body = {
            "source_id": source_id,
            "idempotency_key": str(uuid.uuid4()),
            "amount_money": {
                "amount": int(amount),
                "currency": "USD"
            },
            "location_id": os.getenv("SQUARE_LOCATION_ID"),
            "autocomplete": True,
            "note": "Payment from web form"
        }

        response = client.payments.create(**body)
        response_dict = response.model_dump()

        if response_dict.get("payment"):
            return jsonify({"success": True, "payment": response_dict["payment"]})
        else:
            return jsonify({"success": False, "error": "Payment failed"}), 400

    except ApiError as e:
        return jsonify({
            "success": False,
            "error": f"Square API Error: {e.status_code} - {e.body}"
        }), 500
  