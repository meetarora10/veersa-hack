# from flask import Blueprint, request, jsonify
# from square.client import Client
# from dotenv import load_dotenv
# import os
# import uuid

# load_dotenv()

# payment_bp = Blueprint('payment', __name__)

# client = Client(
#     access_token=os.environ['SQUARE_ACCESS_TOKEN'],
#     environment='sandbox'  # or 'production'
# )

# @payment_bp.route('/api/pay', methods=['POST'])
# def pay():
#     data = request.json
#     print(f"Payment data received: {data}")  # Debug log

#     try:
#         body = {
#             "source_id": data["sourceId"],
#             "amount_money": {
#                 "amount": int(float(data["amount"]) * 100),
#                 "currency": "USD"
#             },
#             "idempotency_key": str(uuid.uuid4()),  # use UUID for safety
#         }

#         print(f"Request body: {body}")
#         result = client.payments.create_payment(body)

#         if result.is_success():
#             return jsonify({"success": True, "payment": result.body.get("payment")})
#         else:
#             print(f"Square API errors: {result.errors}")
#             return jsonify({"success": False, "errors": result.errors}), 400

#     except Exception as e:
#         print(f"General Error: {e}")
#         return jsonify({"success": False, "error": str(e)}), 500
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
print(f"Square token exists: {bool(os.environ.get('SQUARE_ACCESS_TOKEN'))}")
print(f"Token starts correctly: {os.environ.get('SQUARE_ACCESS_TOKEN', '')[:10]}...")

@payment_bp.route("/api/pay", methods=["POST"])
def pay():
    data = request.get_json()
    source_id = data.get("sourceId")
    amount = data.get("amount")
    
    # locations = client.locations.list()
    # print("Available locations for this token:")
    # print(locations.locations)

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
  