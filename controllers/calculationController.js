const formatNumbersWithCommas = require('../utils/formatNumberWithCommas');

const fundsModel = require('../models/fundModel')();
const costModel = require('../models/costModel')();

function calculationController() {

  // Get Costs By User Email
  const getUserDetails = async (req, res) => {
    const { user: userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ status: 'error', message: 'User Email ID is required' });
    }

    try {
      // Fetch total expense and total income concurrently

      const totalExpense = await costModel.getUserTotalCostAmount(userEmail)
      const currentMonthExpense = await costModel.getAMonthUserTotalCostAmount(userEmail, true)
      const prevMonthMonthExpense = await costModel.getAMonthUserTotalCostAmount(userEmail, false)
      const totalIncome = await fundsModel.getUserTotalFundAmount(userEmail)
      const currentMonthFund = await fundsModel.getAMonthUserTotalFundAmount(userEmail, true)
      const prevMonthFund = await fundsModel.getAMonthUserTotalFundAmount(userEmail, false)


      if (totalExpense && currentMonthExpense && prevMonthMonthExpense && totalIncome && currentMonthFund && prevMonthFund) {

        const incomeMoney = Number(totalIncome?.money) || 0;
        const expenseMoney = Number(totalExpense?.money) || 0;
        const restFund = { money: incomeMoney - expenseMoney };
        // const restFund = { money: totalIncome?.money - totalExpense?.money }
        console.log('Rest FUnd', restFund);

        // Format all money values
        const formattedTotalExpense = { ...totalExpense, money: formatNumbersWithCommas(totalExpense?.money) };
        const formattedCurrentMonthExpense = { ...currentMonthExpense, money: formatNumbersWithCommas(currentMonthExpense?.money) };
        const formattedPrevMonthExpense = { ...prevMonthMonthExpense, money: formatNumbersWithCommas(prevMonthMonthExpense?.money) };
        const formattedTotalIncome = { ...totalIncome, money: formatNumbersWithCommas(totalIncome?.money) };
        const formattedCurrentMonthFund = { ...currentMonthFund, money: formatNumbersWithCommas(currentMonthFund?.money) };
        const formattedPrevMonthFund = { ...prevMonthFund, money: formatNumbersWithCommas(prevMonthFund?.money) };
        const formattedRestFund = { money: formatNumbersWithCommas(restFund.money) };

        // Combine formatted results into an array
        const result = {
          totalExpense: formattedTotalExpense,
          totalIncome: formattedTotalIncome,
          currentMonthExpense: formattedCurrentMonthExpense,
          prevMonthMonthExpense: formattedPrevMonthExpense,
          currentMonthFund: formattedCurrentMonthFund,
          prevMonthFund: formattedPrevMonthFund,
          restFund: formattedRestFund
        };

        // Log and send the response
        res.json({
          status: "Success",
          message: 'Executed Successfully',
          result: result
        })
      }
    } catch (err) {
      console.error('Error getting Data By User Email:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  const getUserCustomYearDetails = async (req, res) => {
    const { user: userEmail, year = new Date().getFullYear() } = req.query;

    if (!userEmail) {
      return res.status(400).json({ status: 'error', message: 'User Email ID is required' });
    }
    try {
      const income = await fundsModel.getUserCurrentYearData(userEmail, year)
      const expense = await costModel.getUserCurrentYearData(userEmail, year)

      console.log('Income', income);


      const totalIncome = income?.total;
      const totalExpense = expense?.total;

      const total = totalIncome + totalExpense;

      let incomePercentage, expensePercentage;
      if (total === 0) {
        incomePercentage = 0;
        expensePercentage = 0;
      } else {
        incomePercentage = Math.round((totalIncome / total) * 100);
        expensePercentage = Math.round((totalExpense / total) * 100);
      }


      // Combine results into an array
      // if (income && expense) {
        if (!income || !expense) {
          return res.status(404).json({
            status: 'error',
            message: 'Income or expense data not found'
          });
        }


        // Format all money values
        const formattedIncome = { ...income, total: formatNumbersWithCommas(income?.total) };
        const formattedExpense = { ...expense, total: formatNumbersWithCommas(expense?.total) };

        const result = {
          income: formattedIncome,
          expense: formattedExpense,
          incomePercentage,
          expensePercentage
        };
        // Log and send the response
        res.json({
          status: "Success",
          message: 'Executed Successfully',
          result: result
        })
      // }
    } catch (err) {
      console.error('Error getting Data By User Email:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  return {
    getUserDetails,
    getUserCustomYearDetails
  }
}

module.exports = calculationController