module.exports = ({ inicio, fin }) => {
  let dateInit = new Date(inicio).getTime();
  let dateEnd = new Date(fin).getTime();

  const diff = dateEnd - dateInit;

  return diff / (1000 * 60 * 60 * 24);
};
