const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.listen(3001, console.log("サーバー起動"))

app.get("/", (req, res) => {
    res.send("プログラミング");
});

const products = require("./data.json");

app.get("/api/products", (req, res) => {
    res.send(products);
});

const YOUR_DOMAIN = process.env.NODE_ENV === 'production' 
    ? 'https://school-ec-shop.vercel.app' 
    : 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {

  try {
    const line_items = [];
    
    for (const item of req.body.items) {
      // 各アイテムのStripe価格を検索
      const prices = await stripe.prices.search({
        query: `product:"${item.stripe_id}"`,
      });
      
      if (prices.data.length > 0) {
        // 価格が見つかった場合、line_itemsに追加
        line_items.push({
          price: prices.data[0].id,
          quantity: item.amount || 1, // 数量が指定されていない場合は1
        });
      } else {
        console.warn(`価格が見つかりませんでした: ${item.stripe_id}`);
      }
    }


    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items,
      mode: 'payment',
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({clientSecret: session.client_secret});
  } catch (error) {
    console.error('チェックアウトセッション作成エラー:', error);
    res.status(500).json({ error: 'チェックアウトセッションの作成に失敗しました' });
  }
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});