const Stripe = require("stripe");

module.exports = {
  async addPagoMovil(req, res) {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const { amount, number, exp_month, exp_year, cvc, description } = req.body;

    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number,
          exp_month,
          exp_year,
          cvc,
        },
      });

      await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description,
        payment_method: paymentMethod.id,
        confirm: true,
      });

      return res.status(200).send({ data: true });
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          return res
            .status(500)
            .send({ data: false, mensaje: "Falta un parámetro obligatorio." });
        case 401:
        case 403:
          return res
            .status(500)
            .send({ data: false, mensaje: "Credenciales inválidas" });
        case 402:
          return res
            .status(500)
            .send({ data: false, mensaje: "Numero de tarjeta incorrecto" });
        case 404:
        case 409:
        case 429:
          return res.status(500).send({ data: false, mensaje: "Error Stripe" });
        default:
          return res
            .status(500)
            .send({ data: false, mensaje: "Campos incorrectos" });
      }
    }
  },
};
