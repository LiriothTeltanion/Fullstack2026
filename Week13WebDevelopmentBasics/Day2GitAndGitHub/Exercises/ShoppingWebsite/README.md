# 🎮 Mini Project - Shopping Website

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/shopping-website-a42400536b.svg" width="100%" alt="Progress card for Shopping Website">

</div>

A basic HTML/CSS shopping layout with a logo at the left, a Products link at the right and a footer with the current year and author. The product cards use inline-block, with a responsive one, two, four or six cards per row. Thirteen items keep at least three rows at the widest layout.

## ▶️ How to run

Run npm run dev from the repository root and open this exercise's index.html. [Products](products.html) is a separate page. Both pages load shared [style.css](style.css), page-specific [products.css](products.css), and the working demo cart in [app.js](app.js). Account pages share [login-signup.css](login-signup.css).

## 🎯 The challenge

- Basic CSS layout uses floats, block and inline-block.
- Three or more product cards fit in a desktop row.
- The header links to the products page.
- The footer shows the year and Kevin's name.

## Extras

The local product illustrations provide real image elements throughout the catalog. The thirteen-item music theme, category filter, persisted cart, sale labels and gentle hover/focus feedback add practice beyond the basic layout. The first eight products retain their original identities and prices. [Login](login.html) and [registration](signup.html) are responsive bonus forms with native HTML validation. Signup collects first name, last name, username, email and password; login collects username and password. Both pages share an account stylesheet and right-aligned navigation. They demonstrate the form layout using test values. Creating accounts and authenticating users require a backend.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 2 - Git and GitHub - Mini Project

## Local images and responsive checks

The brand includes an accessible, locally served Font Awesome guitar icon. All thirteen products use lightweight original SVG illustrations, with descriptive alternatives and no runtime external image requests. See [image credits and license notices](assets/README.md).

The product layout uses floats, blocks and `inline-block`, without Flexbox or CSS Grid. Bonus media queries begin at 600, 768, 992 and 1200 CSS pixels, producing one, two, four and six cards per row respectively; smaller screens also use one. Thirteen products therefore span three rows even at six columns. Filtering changes the number of displayed items naturally.

Sale examples show the previous amount with a strikethrough and preserve the current price used by the cart. Product hover and keyboard focus reveal a short image zoom and card lift; reduced-motion preferences disable movement. These are original design additions, not a claim about an exact reference discount percentage.

The cart and valid account forms remain local demonstrations. Checkout sends no order, charges no payment, and clears only the demo cart. A valid account form displays an explanatory status and sends no credentials or account request. Use fictional test values.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
