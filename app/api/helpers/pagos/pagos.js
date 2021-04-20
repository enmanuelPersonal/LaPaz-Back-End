const Stripe = require('stripe');
require('dotenv').config();

module.exports = {
  async paymentStripe({ amount, id, description }) {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    try {
      await stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        description,
        payment_method: id,
        confirm: true,
      });

      return {
        error: false,
      };
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          return { error: true, mensaje: 'Falta un parámetro obligatorio.' };
        case 401:
        case 403:
          return { error: true, mensaje: 'Credenciales inválidas' };
        case 402:
          return { error: true, mensaje: 'Numero de tarjeta incorrecto' };
        case 404:
        case 409:
        case 429:
          return { error: true, mensaje: 'Error Stripe' };
        default:
          return { error: true, mensaje: 'Error en el servidor' };
      }
    }
  },
};
