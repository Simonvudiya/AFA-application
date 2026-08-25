def convert_to_standard(quantity: float, unit: str, bag_weight_kg: int = None) -> tuple:
    """Returns (standard_quantity, standard_unit)"""
    unit = unit.lower()

    if unit == "tonnes":
        return quantity, "tonnes"
    elif unit == "kg":
        return quantity / 1000, "tonnes"
    elif unit == "bags" and bag_weight_kg:
        return (quantity * bag_weight_kg) / 1000, "tonnes"
    elif unit in ["crates", "boxes", "bales", "pieces", "litres"]:
        return quantity, unit
    else:
        return quantity, unit
