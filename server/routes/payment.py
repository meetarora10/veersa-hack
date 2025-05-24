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
from square.environment import SquareEnvironment
from square.core.api_error import ApiError
from dotenv import load_dotenv
import os

load_dotenv()

payment_bp = Blueprint('payment', __name__)

client = Square (
    environment=SquareEnvironment.SANDBOX,
    token=os.environ['SQUARE_ACCESS_TOKEN']
)
print(f"Square token exists: {bool(os.environ.get('SQUARE_ACCESS_TOKEN'))}")
print(f"Token starts correctly: {os.environ.get('SQUARE_ACCESS_TOKEN', '')[:10]}...")

@payment_bp.route('/api/pay', methods=['POST'])
def pay():
    data = request.json
    print(f"Payment data received: {data}")  # Debug log
    
    try:
        body = {
            "source_id": data["sourceId"],
            "amount_money": {
                "amount": int(float(data["amount"]) * 100),
                "currency": "INR"
            },
            "idempotency_key": f"{data.get('patient_id', '')}-{data.get('doctorId', '')}-{data['amount']}"
        }
        
        print(f"Request body: {body}")  # Debug log
        payment_api = client.payments
        print(dir(payment_api))  # Debug log to check available methods
        response = payment_api.create(source_id=data["sourceId"], idempotency_key=body['idempotency_key'])

        if response.is_success():
            return jsonify({"success": True, "payment": response.body.get('payment')})
        else:
            print(f"Square API errors: {response.errors}")
            return jsonify({"success": False, "errors": response.errors}), 400
            
    except ApiError as e:
        print(f"API Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        print(f"General Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500