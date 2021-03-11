const randomName = () => {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let nameRandom = '';
  for (let i = 0; i < 6; i++) {
    nameRandom += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return nameRandom;
};

module.exports = randomName;
