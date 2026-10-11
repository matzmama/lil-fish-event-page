from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

from models import Customer, Quote, db


app = Flask(__name__)

# React runs on port 5173 during development.
CORS(app, origins=["http://localhost:5173"])

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///lil_fish.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Make sure the folder for the SQLite database exists.
Path(app.instance_path).mkdir(parents=True, exist_ok=True)

with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Lil Fish Community Center API is running!",
        "storage": "SQLite + SQLAlchemy",
    }), 200


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "message": "Lil Fish Community Center API is healthy!",
        "storage": "SQLite + SQLAlchemy",
    }), 200


@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    quotes = db.session.execute(
        db.select(Quote)
    ).scalars().all()

    return jsonify([
        quote.to_dict() for quote in quotes
    ]), 200


@app.route("/api/quotes/<int:quote_id>", methods=["GET"])
def get_quote(quote_id):
    quote = db.session.get(Quote, quote_id)

    if quote is None:
        return jsonify({
            "error": "Quote not found."
        }), 404

    return jsonify(quote.to_dict()), 200


@app.route("/api/quotes", methods=["POST"])
def create_quote():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request must contain JSON data."
        }), 400

    customer_data = data.get("customer")
    event_data = data.get("event")
    selected_packages = data.get("selectedPackages", {})
    pricing_data = data.get("pricing", {})

    if not customer_data:
        return jsonify({
            "error": "Customer information is required."
        }), 400

    if not event_data:
        return jsonify({
            "error": "Event information is required."
        }), 400

    required_customer_fields = [
        "name",
        "email",
        "phone",
    ]

    missing_customer_fields = [
        field
        for field in required_customer_fields
        if not str(customer_data.get(field, "")).strip()
    ]

    if missing_customer_fields:
        return jsonify({
            "error": (
                "Missing required customer fields: "
                + ", ".join(missing_customer_fields)
            )
        }), 400

    required_event_fields = [
        "eventType",
        "eventTypeLabel",
        "eventDate",
        "preferredStartTime",
        "guestCount",
    ]

    missing_event_fields = [
        field
        for field in required_event_fields
        if event_data.get(field) in (None, "")
    ]

    if missing_event_fields:
        return jsonify({
            "error": (
                "Missing required event fields: "
                + ", ".join(missing_event_fields)
            )
        }), 400

    try:
        guest_count = int(event_data["guestCount"])
    except (TypeError, ValueError):
        return jsonify({
            "error": "Guest count must be a whole number."
        }), 400

    if guest_count < 1:
        return jsonify({
            "error": "Guest count must be at least 1."
        }), 400

    customer = Customer(
        name=customer_data["name"].strip(),
        email=customer_data["email"].strip(),
        phone=customer_data["phone"].strip(),
    )

    quote = Quote(
        customer=customer,
        event_type=event_data["eventType"],
        event_type_label=event_data["eventTypeLabel"],
        event_date=event_data["eventDate"],
        preferred_start_time=event_data["preferredStartTime"],
        guest_count=guest_count,
        message=event_data.get("message", ""),
        selected_packages=selected_packages,
        pricing=pricing_data,
    )

    db.session.add(quote)
    db.session.commit()

    return jsonify({
        "message": "Your quote request was saved successfully!",
        "quote": quote.to_dict(),
    }), 201


@app.route("/api/quotes/<int:quote_id>", methods=["PUT"])
def update_quote(quote_id):
    quote = db.session.get(Quote, quote_id)

    if quote is None:
        return jsonify({
            "error": "Quote not found."
        }), 404

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request must contain JSON data."
        }), 400

    customer_data = data.get("customer", {})
    event_data = data.get("event", {})

    if "name" in customer_data:
        quote.customer.name = customer_data["name"]

    if "email" in customer_data:
        quote.customer.email = customer_data["email"]

    if "phone" in customer_data:
        quote.customer.phone = customer_data["phone"]

    if "eventType" in event_data:
        quote.event_type = event_data["eventType"]

    if "eventTypeLabel" in event_data:
        quote.event_type_label = event_data["eventTypeLabel"]

    if "eventDate" in event_data:
        quote.event_date = event_data["eventDate"]

    if "preferredStartTime" in event_data:
        quote.preferred_start_time = (
            event_data["preferredStartTime"]
        )

    if "guestCount" in event_data:
        quote.guest_count = event_data["guestCount"]

    if "message" in event_data:
        quote.message = event_data["message"]

    if "selectedPackages" in data:
        quote.selected_packages = data["selectedPackages"]

    if "pricing" in data:
        quote.pricing = data["pricing"]

    db.session.commit()

    return jsonify(quote.to_dict()), 200


@app.route("/api/quotes/<int:quote_id>", methods=["DELETE"])
def delete_quote(quote_id):
    quote = db.session.get(Quote, quote_id)

    if quote is None:
        return jsonify({
            "error": "Quote not found."
        }), 404

    db.session.delete(quote)
    db.session.commit()

    return jsonify({
        "message": f"Quote {quote_id} deleted successfully."
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)