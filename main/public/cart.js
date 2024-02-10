import express from "express";

const payBtn = document.querySelector(".white.btn-buy");
const app = express();

app.post("/stripe-checkout", async (req, res) => {
  const lineItems = req.body.items.map((item) => {
    const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
    console.log("PG item-price:", item.price);
    console.log("unitAmount:", unitAmount);
    return {
      price_data: {
        currency: "USD",
        product_data: {
          name: item.title,
          images: [item.productImg],
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
  console.log("lineItems:", lineItems);
  //create Checkout Session
  const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/success`,
    cancel_url: `${DOMAIN}/cancel`,
    line_items: lineItems,
    //Asking Address In Stripe Checkout
    billing_address_collection: "required",
  });
  res.json(session.url);
});

payBtn.addEventListener("click", () => {
  console.log("PG");
  fetch("/stripe-checkout", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/Json" }),
    body: JSON.stringify({
      items: JSON.parse(localStorage.getItem("cartItems")),
    }),
  })
    .then((res) => res.json())
    .then((url) => {
      location.href = url;
      clearCart();
    })
    .catch((err) => console.log(err));
});

document.cookie = "cookieName=cookieValue; SameSite=None; Secure";
