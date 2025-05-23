from flask import Blueprint, request, jsonify
from square import Square
from square.environment import SquareEnvironment
from square.core.api_error import ApiError
from dotenv import load_dotenv
import os

load_dotenv()

payment_bp = Blueprint('payment', __name__)

client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=os.environ['SQUARE_ACCESS_TOKEN']
)

@payment_bp.route('/api/pay', methods=['POST'])
def pay():
    data = request.json
    try:
        body = {
            "source_id": data["sourceId"],
            "amount_money": {
                "amount": int(float(data["amount"]) * 100),
                "currency": "INR"
            },
            "idempotency_key": f"{data.get('patient_id', '')}-{data.get('doctorId', '')}-{data['amount']}"
        }

        response = client.payments.create_payment(body)
        return jsonify({"success": True, "payment": response.payment})

    except ApiError as e:
        return jsonify({"success": False, "error": [err.detail for err in e.errors]}), 400
