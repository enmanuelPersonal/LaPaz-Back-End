const fs = require('fs-extra');
const path = require('path');
const randomName = require('../../utils/randomName');

module.exports = {
  async addImg(req, res) {
    const file = req.file;
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    const imgTemPath = file.path;

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
      await fs.unlink(imgTemPath);
      return res
        .status(500)
        .json({ error: 'La imagen no cumple con el formato valido' });
    }

    let imgUrl = randomName();
    try {
      const targetPath = path.resolve(`app/public/uploads/${imgUrl}${ext}`);

      await fs.rename(imgTemPath, targetPath);
    } catch (error) {
      await fs.unlink(imgTemPath);
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }
  },
};
