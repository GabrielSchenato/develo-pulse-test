const express = require("express");
const app = express();
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const axios = require("axios");

app.use(express.json());
app.use(cors());

app.post(
  "/contact-us",
  body("firstName").not().isEmpty().trim().isLength({ max: 40 }),
  body("lastName").not().isEmpty().trim().isLength({ max: 40 }),
  body("streetAddress").not().isEmpty().trim().isLength({ max: 128 }),
  body("unitApt").trim().isLength({ max: 128 }),
  body("provinceTerritoryState").not().isEmpty().trim().isLength({ max: 32 }),
  body("city").not().isEmpty().trim().isLength({ max: 32 }),
  body("email").not().isEmpty().trim().isLength({ max: 128 }).isEmail(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const info = {
      Name: `${req.body.firstName} ${req.body.lastName}`,
      Address: req.body.streetAddress,
      Address2: req.body.unitApt,
      City: req.body.city,
      Province: req.body.provinceTerritoryState,
      Email: req.body.email,
    };

    const { data } = await axios.post(
      `https://imc-hiring-test.azurewebsites.net/Contact/Save`,
      info
    );

    return res.status(200).json({
      success: data.StatusCode === 200,
      message: "",
    });
  }
);
app.listen(3030);
