import express from "express";
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";

const app = express();

app.use(bodyParser.json());

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.post(
  "/",
  body("initialSavings").isInt({ min: 0 }),
  body("monthlyDeposit").isInt({ min: 0 }),
  body("interestRate").isFloat({ min: 0 }),
  body("years").default(60).isInt({ min: 1, max: 100 }),
  (req, res) => {
    try {
      // validate data using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // if data is invalid, return 400 with errors
        res.status(400).json({ errors: errors.array() });
      }
      // destructuring data
      let { initialSavings, monthlyDeposit, interestRate, years } = req.body;
      // convert percentage to decimal
      interestRate /= 100;
      const data: number[] = [];
      for (let month = 0; month < years * 12; month += 12) {
        // for every year, calculate the the user's savings
        if (interestRate == 0) {
          // to prevent division the value to be null from dividing by 0
          data.push(monthlyDeposit * month + initialSavings);
        } else {
          data.push(
            monthlyDeposit *
              (((1 + interestRate) ** month - 1) / interestRate) +
              initialSavings * (1 + interestRate) ** month
          );
        }
      }
      // return data as json
      res.status(200).json({ data: data });
    } catch (error) {
      res.status(400).json({ errors: [error] });
    }
  }
);

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
