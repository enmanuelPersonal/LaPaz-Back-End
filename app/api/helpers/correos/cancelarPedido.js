const nodemailer = require("nodemailer");

const { CORREO, CORREO_PASS } = process.env;

module.exports = {
  async cancelarCorreoPedido({ correo, detalle, total, fecha }) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: CORREO,
          pass: CORREO_PASS,
        },
      });

      let htmlCorreo = `
        <table
        width="600"
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="width: 600px"
        >
        <tbody>
            <tr>
            <td
                align="center"
                style="
                padding-top: 20px;
                padding-left: 70px;
                padding-right: 70px;
                background-color: #fff;
                "
            >
                <table
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="background-color: #fff; font-weight: 200"
                >
                <tbody>
                    <tr>
                    <td align="center" style="padding-bottom: 20px;">
                    <samp
                    style="
                      color: #832192;
                      font-size: 40px;
                      font-family: Arial, Helvetica, sans-serif;
                      font-weight: bold;
                      border-top: 5px solid rgb(190, 187, 187);
                        border-bottom:  5px solid rgb(190, 187, 187);
                    "
                    > FUNERARIA LA PAZ</samp
                  </td>
                    </tr>
                    <tr>
                    <td style="padding: 10px 0">
                        <h1
                        style="
                            font-size: 30px;
                            line-height: 36px;
                            color: #606060 !important;
                            margin: 0;
                            font-weight: bold;
                            text-align: center;
                            font-family: Helvetica, Arial, sans-serif;
                        "
                        >
                        Solicitud de productos el ${fecha}
                        </h1>
                    </td>
                    </tr>
                    <tr>
                    <td align="justify" style="padding: 20px 15px 5px">
                        ${detalle.map(
                          ({ nombre, descripcion, cantidad, precio }) => {
                            return `
                        <table
                        width="100%"
                        style="
                            background-color: #f2f2f2;
                            font-family: Helvetica, Arial, sans-serif;
                            table-layout: fixed;
                        "
                        >
                        <tbody>
                            <tr>
                            <td>
                                <table>
                                <tbody>
                                    <tr>
                                    <td style="padding-left: 15px">
                                        <p>
                                        <samp
                                                  style="
                                                    color: 000;
                                                    font-size: 17px;
                                                    font-family: Arial, Helvetica, sans-serif;
                                                    font-weight: bold;
                                                  "
                                                  >Producto: </samp> ${nombre}</p>
                                        <p>
                                        <samp
                                                  style="
                                                    color: 000;
                                                    font-size: 17px;
                                                    font-family: Arial, Helvetica, sans-serif;
                                                    font-weight: bold;
                                                  "
                                                  >Descripcion: </samp>${descripcion}</p>
                                        <p>
                                        <samp
                                                  style="
                                                    color: 000;
                                                    font-size: 17px;
                                                    font-family: Arial, Helvetica, sans-serif;
                                                    font-weight: bold;
                                                  "
                                                  >Cantidad: </samp>${cantidad}</p>
                                        <p>
                                        <samp
                                                  style="
                                                    color: 000;
                                                    font-size: 17px;
                                                    font-family: Arial, Helvetica, sans-serif;
                                                    font-weight: bold;
                                                  "
                                                  >Precio: </samp>${precio}</p>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        `;
                          }
                        )}
                    </td>
                    </tr>
                    <tr>
                    <td align="justify" style="padding: 20px 15px 5px">
                        <table
                        width="100%"
                        style="
                            text-align: center;
                            font-size: 20px;
                            font-weight: bold;
                            border-top: 1px solid #000;
                            border-bottom: 1px solid #000;
                        "
                        >
                        <tbody>
                            <tr>
                            <td style="padding: 10px 0">TOTAL:</td>
                            <td style="padding: 10px 0">${total}</td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding: 20px 0 20px">
                        <p
                        style="
                            font-size: 15px;
                            line-height: 22px;
                            color: #606060 !important;
                            font-family: Helvetica, Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        "
                        >
                        Para cualquier problema, póngase en contacto con
                        nosotros:
                        <a
                            style="color: #bd3535"
                            href="mailto:lapaz@gmail.com"
                            target="_blank"
                            >lapaz@gmail.com
                        </a>
                        </p>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
            <tr>
            <td align="justify" style="padding: 20px 15px 5px">
                <table
                width="100%"
                style="
                    text-align: center;
                    font-size: 11px;
                    border-top: 1px solid #bd3535;
                    border-bottom: 1px solid #bd3535;
                "
                >
                <tbody>
                    <tr>
                    <td style="padding: 10px 0">
                        <a
                        href="https://www.facebook.com/"
                        style="
                            text-decoration: none;
                            font-weight: bold;
                            color: #262626;
                            font-family: Helvetica, Arial, sans-serif;
                        "
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/montao.net/?modal%3Dadmin_todo_tour&amp;source=gmail&amp;ust=1577464346759000&amp;usg=AFQjCNE8-cfnmN7AWWBRYfIGr4K2xz3GSw"
                        >FACEBOOK
                        </a>
                    </td>
                    <td style="padding: 10px 0">
                        <a
                        href="https://www.instagram.com/"
                        style="
                            text-decoration: none;
                            font-weight: bold;
                            color: #262626;
                            font-family: Helvetica, Arial, sans-serif;
                        "
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/montao.net_/&amp;source=gmail&amp;ust=1577464346759000&amp;usg=AFQjCNE3z4UEX3I_u6-8WTzHch0qIFqGzA"
                        >INSTAGRAM
                        </a>
                    </td>
                    <td style="padding: 10px 0">
                        <a
                        href="https://wa.me/8096125752"
                        style="
                            text-decoration: none;
                            font-weight: bold;
                            color: #262626;
                            font-family: Helvetica, Arial, sans-serif;
                        "
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://wa.me/8095759276&amp;source=gmail&amp;ust=1577464346759000&amp;usg=AFQjCNFSCVsWHwEQAh5xD8tdFFHiBoBn_Q"
                        >WHATSAPP
                        </a>
                    </td>
                    </tr>
                </tbody>
                </table>
                </td>
                </tr>
            </tbody>
            </table>
        </center>
        </td>
        </tr>
        </tbody>
        </table>
    `;

      const mailOptions = {
        from: `Funeraria LaPaz <${CORREO}>`,
        to: correo,
        subject: "Cancelacion de pedido",
        html: htmlCorreo,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          const Error_MSJ = {
            descripcion: "Error al enviar el correo de cancelacion de pedido",
            causa: error,
          };

          return false;
        } else {
          return true;
        }
      });

      return {
        error: false,
      };
    } catch (error) {
      console.log("Error: ", error);
      return true;
    }
  },
};
