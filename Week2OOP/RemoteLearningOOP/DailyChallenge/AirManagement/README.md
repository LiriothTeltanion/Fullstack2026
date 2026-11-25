# 💪 Daily Challenge - Air Management

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/air-management-2c6b6fc9f2.svg" width="100%" alt="Progress card for Air Management">

</div>

`air_management.py` is a tiny airline system with four classes: airlines, planes, flights and airports. A plane flies at most once per day, and every list of flights stays sorted by date.

## ▶️ How to run

```bash
python air_management.py
```

```text
📋 TLV departures 2025-10-10..2025-10-15:
  2025-10-12 | LHR-AR-2025-10-12 | TLV → LHR | Plane #101 (AR)
  2025-10-13 | CDG-NX-2025-10-13 | TLV → CDG | Plane #202 (NX)

🛬 Executed: LHR-AR-2025-10-12 | Plane now at: LHR
TLV on-ground: [202]
LHR on-ground: [303, 101]
```

Plane 101 flies to London. Plane 202's Paris flight is only booked, so it stays at TLV.

## 🎯 The challenge

| Class | What it does |
|---|---|
| `Airline` | A two-letter `id`, a `name` and a list of `planes` |
| `Airplane` | `location_on_date(d)` says where the plane is at the start of day `d`. `available_on_date(d, airport)` checks it's there with no flight that day. `schedule()` keeps `next_flights` sorted, and `fly(destination)` runs the earliest flight to that airport |
| `Flight` | Builds its id from destination, airline and date (`LHR-AR-2025-10-12`). `take_off()` and `land()` move the plane from one airport's list to the other |
| `Airport` | `schedule_flight(destination, date, airline=None)` picks a free plane (lowest id wins) and adds the flight to every schedule. `info(start, end)` lists departures between two dates |

`schedule_flight()` also scans the airports from `register_airports()` for planes that will have landed by then. There are no times of day and no stops: "where is the plane" means before that day's take-off.

## 🧠 What I learned

- A flight touches the plane, the origin and the destination, so all three lists have to change together
- `datetime.date` objects compare with `<`, so `sort(key=lambda f: f.date)` keeps schedules in order
- `location_on_date()` works the position out from booked flights, and nothing extra is stored
- Choosing the plane with `sorted(candidates, key=lambda p: p.id)[0]` gives the same answer on every run

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Remote Learning - Object-Oriented Programming - Daily Challenge
