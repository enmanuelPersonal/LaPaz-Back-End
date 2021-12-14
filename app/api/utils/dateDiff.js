module.exports = ({ inicio, fin }) => {
  console.log("fechas ", inicio, fin);
  let dateInit = new Date(inicio).getTime();
  let dateEnd = new Date(fin).getTime();
  console.log("fechas 3", dateInit, dateEnd);
  const diff = dateEnd - dateInit;

   res = diff / (1000 * 60 * 60 * 24);
   console.log("==================> ", res);

   return res;
};
