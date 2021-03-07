const moment = require("moment");
const plans = {
  gold: 30,
  silver: 20,
  bronze: 10,
};
const actions = [
  {
    date: moment("2020-01-01").endOf("day").toDate(),
    plan: "gold",
    action: "start",
  },
  {
    date: moment("2020-01-10").endOf("day").toDate(),
    plan: "gold",
    action: "stop",
  },
  {
    date: moment("2020-01-15").endOf("day").toDate(),
    plan: "silver",
    action: "start",
  },
  {
    date: moment("2020-01-21").endOf("day").toDate(),
    plan: "silver",
    action: "stop",
  },
  {
    date: moment("2020-01-21").endOf("day").toDate(),
    plan: "bronze",
    action: "start",
  },
  {
    date: moment("2020-03-01").endOf("day").toDate(),
    plan: "bronze",
    action: "stop",
  },
  {
    date: moment("2020-03-01").endOf("day").toDate(),
    plan: "silver",
    action: "start",
  },
  {
    date: moment("2020-03-10").endOf("day").toDate(),
    plan: "silver",
    action: "stop",
  },
  {
    date: moment("2020-03-11").endOf("day").toDate(),
    plan: "gold",
    action: "start",
  },
  {
    date: moment("2020-03-20").endOf("day").toDate(),
    plan: "gold",
    action: "stop",
  },
];

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isBiggerPlan(a, b) {
  return plans[b] > plans[a];
}

function generateBill() {
  const bills = [];
  actions.forEach((action) => {
    if (action.action == "stop") {
      let curr = bills[bills.length - 1].from;
      const mDiff = parseInt(moment(action.date).diff(curr, "months", true));
      bills[bills.length - 1].to = action.date;
      for (let i = 0; i < mDiff; i++) {
        const lastDayOfMonth = new Date(
          curr.getFullYear(),
          curr.getMonth() + 1,
          0
        );
        bills[bills.length - 1].to = moment(lastDayOfMonth)
          .endOf("day")
          .toDate();
        curr = moment(addDays(lastDayOfMonth, 1)).endOf("day").toDate();
        bills.push({
          from: curr,
          to: action.date,
          plan: action.plan,
        });
      }
      if (bills[bills.length - 1].from > bills[bills.length - 1].to) {
        bills.pop();
      }
    } else if (action.action == "start") {
      if (bills.length > 0) {
        if (moment(bills[bills.length - 1].to).isSame(action.date)) {
          if (isBiggerPlan(bills[bills.length - 1].plan, action.plan)) {
            bills[bills.length - 1].to = moment(bills[bills.length - 1].to)
              .subtract(1, "days")
              .endOf("day")
              .toDate();
            if (bills[bills.length - 1].from > bills[bills.length - 1].to) {
              bills.pop();
            }
            bills.push({
              from: action.date,
              to: action.date,
              plan: action.plan,
            });
          } else {
            const nextDate = moment(addDays(action.date, 1))
              .endOf("day")
              .toDate();
            bills.push({
              from: nextDate,
              to: nextDate,
              plan: action.plan,
            });
          }
        } else {
          bills.push({
            from: action.date,
            to: action.date,
            plan: action.plan,
          });
        }
      } else {
        bills.push({
          from: action.date,
          to: action.date,
          plan: action.plan,
        });
      }
    }
  });
  bills.forEach((bill) => {
    const days = moment(bill.to).diff(bill.from, "days") + 1;
    const cost = plans[bill.plan] * days;
    console.log(
      moment(bill.from).format("ll"),
      " - ",
      moment(bill.to).format("ll"),
      bill.plan,
      cost,
      "Rs"
    );
  });
}
generateBill();
