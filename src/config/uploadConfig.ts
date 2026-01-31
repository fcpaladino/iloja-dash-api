import path from "path";
import multer from "multer";
import fs from "fs";

const publicFolder = path.resolve(__dirname, "..", "..", "midias");

export default {
  directory: publicFolder,

  storage: multer.diskStorage({

    destination: function (req, file, cb) {
      const { companyId } = req.user;

      var fs = require('fs');
      let dir = __dirname+"/../../midias/company"+companyId+"/config";
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      cb(null, path.resolve(__dirname, "..", "..", "midias", "company"+companyId, "config"))
    },

    filename(req, file, cb) {
      const fileName = new Date().getTime() + path.extname(file.originalname);

      return cb(null, fileName);
    }
  })
};
