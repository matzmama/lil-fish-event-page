# Lil Fish Community Center
# Event Quote Calculator

venue_name = "Lil Fish Community Center"
event_type = "Wedding"

guest_count = 200
venue_available = True

base_price = 5000.00 # Base price for 4 hours of venue rental 
bridal_suite_fee = 300.00 # Bridal suite fee for 4 hours
decoration_package = 350.00
music_package = 600.00
cleaning_fee = 220.00
Refundable_deposit = 500.00   # Insurance fee refundable deposit 
Security_fee = 1200.00  # Security per officer 100 per hour per officer 
Catering_fee = 4000.00 # Catering is 20 per person for 200 guests 


estimated_total = (
    base_price
    + decoration_package
    + music_package
    + bridal_suite_fee
    + cleaning_fee
    + Refundable_deposit
    + Security_fee
    + Catering_fee
)

print("--------------------------------")
print("LIL FISH EVENT QUOTE")
print("--------------------------------")

print("Venue:", venue_name)
print("Event type:", event_type)
print("Guest count:", guest_count)
print("Venue available:", venue_available)

print("--------------------------------")
print(f"Base price: ${base_price:,.2f}")
print(f"Decorations: ${decoration_package:,.2f}")
print(f"Music package: ${music_package:,.2f}")
print(f"Bridal suite: ${bridal_suite_fee:,.2f}")
print(f"Cleaning fee: ${cleaning_fee:,.2f}")
print(f"Refundable deposit: ${Refundable_deposit:,.2f}")
print(f"Security fee: ${Security_fee:,.2f}")
print(f"Catering fee: ${Catering_fee:,.2f}")
print("--------------------------------")

print(f"Estimated total: ${estimated_total:,.2f}")