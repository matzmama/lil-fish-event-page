from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=False)

    quotes = db.relationship(
        "Quote",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
        }


class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False
    )

    event_type = db.Column(db.String(100), nullable=False)
    event_type_label = db.Column(db.String(150), nullable=False)
    event_date = db.Column(db.String(20), nullable=False)
    preferred_start_time = db.Column(db.String(20), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text, nullable=True)

    selected_packages = db.Column(
        db.JSON,
        nullable=False,
        default=dict
    )

    pricing = db.Column(
        db.JSON,
        nullable=False,
        default=dict
    )

    customer = db.relationship(
        "Customer",
        back_populates="quotes"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "customer": self.customer.to_dict(),
            "event": {
                "eventType": self.event_type,
                "eventTypeLabel": self.event_type_label,
                "eventDate": self.event_date,
                "preferredStartTime": self.preferred_start_time,
                "guestCount": self.guest_count,
                "message": self.message,
            },
            "selectedPackages": self.selected_packages,
            "pricing": self.pricing,
        }
