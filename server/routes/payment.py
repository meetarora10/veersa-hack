from flask import Blueprint, request, jsonify
from square import Square
from square.core.api_error import ApiError
from square.environment import SquareEnvironment
from dotenv import load_dotenv
import os
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

load_dotenv()

payment_bp = Blueprint('payment', __name__)

client = Square(
    token=os.getenv("SQUARE_ACCESS_TOKEN"),
    environment=SquareEnvironment.SANDBOX
)

@payment_bp.route("/api/pay", methods=["POST"])
@jwt_required()
def pay():
    try:
        current_user_id = get_jwt_identity()
        print("Current user ID:", current_user_id)
        if not current_user_id:
            return jsonify({"success": False, "message": "Unauthorized access"}), 401

        user = User.query.get(int(current_user_id))
        print("User:", user)
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 401

        data = request.get_json()
        print("Request data:", data)
        source_id = data.get("sourceId")
        amount = data.get("amount")
        print("Source ID:", source_id, "Amount:", amount)
        
        if not source_id or not amount:
            return jsonify({"success": False, "message": "Missing sourceId or amount"}), 400

        location_id = os.getenv("SQUARE_LOCATION_ID")
        print("SQUARE_LOCATION_ID:", location_id)
        print("SQUARE_ACCESS_TOKEN:", os.getenv("SQUARE_ACCESS_TOKEN"))

        locations = client.locations.list()
        print("Available locations for this token:")
        print(locations.locations)

        body = {
            "source_id": source_id,
            "idempotency_key": str(uuid.uuid4()),
            "amount_money": {
                "amount": int(amount),
                "currency": "USD"
            },
            "location_id": location_id,
            "autocomplete": True,
            "note": f"Payment from user {user.id}"
        }
        print("Payment body:", body)

        response = client.payments.create(**body)
        response_dict = response.model_dump()
        print("Square API response:", response_dict)

        if response_dict.get("payment"):
            return jsonify({"success": True, "data": {"payment": response_dict["payment"]}})
        else:
            return jsonify({"success": False, "message": "Payment failed"}), 400

    except ApiError as e:
        print(f"Square API Error: {e.status_code} - {e.body}")
        return jsonify({
            "success": False,
            "message": f"Square API Error: {e.status_code} - {e.body}"
        }), 500
    except Exception as e:
        print(f"Payment error: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
  