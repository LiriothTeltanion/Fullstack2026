"""Module: exercisesxpplus
Purpose: Day 3 XP+ extensions for student grading and sales analytics.
Author: Kevin Cusnir 'Lirioth'
Created: 2025-10-18
Last Updated: 2025-10-19

Overview:
    - Calculate averages and letter grades for student cohorts
    - Analyse sales transactions for business insights
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Sequence


GRADE_THRESHOLDS: Sequence[tuple[float, str]] = (
    (90, "A"),
    (80, "B"),
    (70, "C"),
    (60, "D"),
)


@dataclass
class StudentGradeReport:
    """Structured summary for the student grade workbook."""

    averages: Dict[str, float]
    letter_grades: Dict[str, str]
    class_average: float


def letter_grade(score: float) -> str:
    """Return the letter grade associated with ``score``.

    Args:
        score: Numeric grade (0-100).

    Returns:
        Letter grade (A-F).
    """

    for threshold, letter in GRADE_THRESHOLDS:
        if score >= threshold:
            return letter
    return "F"


def calculate_student_grades(grades: Dict[str, Iterable[float]]) -> StudentGradeReport:
    """Compute averages, letter grades, and class average for students.

    Args:
        grades: Mapping of student name to iterable of numeric scores.

    Returns:
        ``StudentGradeReport`` with per-student and class summaries.
    """

    averages: Dict[str, float] = {}
    letter_grades: Dict[str, str] = {}
    for name, marks in grades.items():
        scores = list(marks)
        if not scores:
            # ⚠️ Avoid division by zero if a student has no recorded scores.
            averages[name] = 0.0
            letter_grades[name] = "N/A"
            continue
        avg = sum(scores) / len(scores)
        averages[name] = avg
        letter_grades[name] = letter_grade(avg)

    class_average = sum(averages.values()) / len(averages) if averages else 0.0
    return StudentGradeReport(averages=averages, letter_grades=letter_grades, class_average=class_average)


@dataclass
class SalesReport:
    """Aggregated metrics for the sales dataset."""

    product_totals: Dict[str, float]
    customer_totals: Dict[int, float]
    high_value_transactions: List[Dict[str, float | int | str]]
    loyal_customers: List[int]
    average_transaction_by_product: Dict[str, float]
    most_popular_products: List[str]


def analyse_sales_data(transactions: Iterable[Dict[str, float | int | str]]) -> SalesReport:
    """Return summary statistics for sales transactions.

    Args:
        transactions: Iterable of dictionaries describing each sale.

    Returns:
        ``SalesReport`` with totals, high-value transactions, and loyalty data.
    """

    product_totals: Dict[str, float] = {}
    customer_totals: Dict[int, float] = {}
    enriched: List[Dict[str, float | int | str]] = []

    for entry in transactions:
        record = dict(entry)
        total_price = float(record["price"]) * float(record["quantity"])
        record["total_price"] = total_price
        enriched.append(record)

        product_totals[record["product"]] = product_totals.get(record["product"], 0.0) + total_price
        customer_id = int(record["customer_id"])
        customer_totals[customer_id] = customer_totals.get(customer_id, 0.0) + total_price

    high_value = [r for r in enriched if r["total_price"] > 500]
    # ✅ Sort by value descending so the priciest transactions surface first.
    high_value.sort(key=lambda item: item["total_price"], reverse=True)

    purchase_counts: Dict[int, int] = {}
    for record in enriched:
        cid = int(record["customer_id"])
        purchase_counts[cid] = purchase_counts.get(cid, 0) + 1
    loyal_customers = [cid for cid, count in purchase_counts.items() if count > 1]

    product_sum: Dict[str, float] = {}
    product_count: Dict[str, int] = {}
    for record in enriched:
        product = record["product"]
        product_sum[product] = product_sum.get(product, 0.0) + record["total_price"]
        product_count[product] = product_count.get(product, 0) + 1
    average_transaction = {
        product: product_sum[product] / product_count[product] for product in product_sum
    }

    quantity_totals: Dict[str, int] = {}
    for record in enriched:
        product = record["product"]
        quantity_totals[product] = quantity_totals.get(product, 0) + int(record["quantity"])
    max_quantity = max(quantity_totals.values(), default=0)
    most_popular = [product for product, qty in quantity_totals.items() if qty == max_quantity]

    return SalesReport(
        product_totals=product_totals,
        customer_totals=customer_totals,
        high_value_transactions=high_value,
        loyal_customers=loyal_customers,
        average_transaction_by_product=average_transaction,
        most_popular_products=most_popular,
    )


def _cli() -> None:
    """Recreate the original prints for both XP+ exercises."""

    student_grades = {
        "Alice": [88, 92, 100],
        "Bob": [75, 78, 80],
        "Charlie": [92, 90, 85],
        "Dana": [83, 88, 92],
        "Eli": [78, 80, 72],
    }
    report = calculate_student_grades(student_grades)
    print("class average:", round(report.class_average, 2))
    for name in student_grades:
        avg = round(report.averages[name], 2)
        print(name, "-", avg, report.letter_grades[name])

    sales_data = [
        {"customer_id": 1, "product": "Smartphone", "price": 600, "quantity": 1, "date": "2023-04-03"},
        {"customer_id": 2, "product": "Laptop", "price": 1200, "quantity": 1, "date": "2023-04-04"},
        {"customer_id": 1, "product": "Laptop", "price": 1000, "quantity": 1, "date": "2023-04-05"},
        {"customer_id": 2, "product": "Smartphone", "price": 500, "quantity": 2, "date": "2023-04-06"},
        {"customer_id": 3, "product": "Headphones", "price": 150, "quantity": 4, "date": "2023-04-07"},
        {"customer_id": 3, "product": "Smartphone", "price": 550, "quantity": 1, "date": "2023-04-08"},
        {"customer_id": 1, "product": "Headphones", "price": 100, "quantity": 2, "date": "2023-04-09"},
    ]

    sales_report = analyse_sales_data(sales_data)
    print("product totals:", sales_report.product_totals)
    print("customer totals:", sales_report.customer_totals)
    print("high value:", sales_report.high_value_transactions)
    print("loyal customers:", sales_report.loyal_customers)
    print("avg transaction by product:", sales_report.average_transaction_by_product)
    print("most popular:", sales_report.most_popular_products)


if __name__ == "__main__":
    _cli()
