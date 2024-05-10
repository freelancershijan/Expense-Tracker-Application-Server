const FundModal = require("../models/fundModel")

class FundsController {
  // Get All Funds
  async getAllFunds(req, res) {
    const fundModel = new FundModal();
    try {
      const result = await fundModel.getAllFunds();
      res.json({ status: 'success', message: 'Executed Successfully', results: { total: result?.length, data: result } });
    } catch (err) {
      console.error('Error getting FUnds:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By IID
  async getFundByID(req, res) {
    const fundModel = new FundModal();
    const fundID = req.params.id;

    if (!fundID) {
      return res.status(400).json({ status: 'error', message: 'FUnd ID is required' });
    }

    try {
      const result = await fundModel.getFundByID(fundID);
      if (result) {
        res.json({ status: 'success', message: 'Executed Successfully', result: result });
      } else {
        res.status(404).json({ status: 'not found', message: 'Fund not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By ID:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By User Email
  async getFundsByUserEmail(req, res) {
    const fundModel = new FundModal();
    const userEmail = req.params.user;

    if (!userEmail) {
      return res.status(400).json({ status: 'error', message: 'User Email ID is required' });
    }

    try {
      const result = await fundModel.getFundsByUserEmail(userEmail);
      if (result.length > 0) {
        res.json({ status: 'success', message: 'Executed Successfully', results: { total: result?.length, data: result } });
      } else {
        res.status(404).json({ status: 'not found', message: 'Fund not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By ID:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By Category
  async getFundsByCategory(req, res) {
    const fundModel = new FundModal();
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({ status: 'error', message: 'Category is required' });
    }

    try {
      const result = await fundModel.getFundsByCategory(category);
      if (result.length > 0) {
        res.json({ status: 'success', message: 'Executed Successfully', results: { total: result?.length, data: result } });
      } else {
        res.status(404).json({ status: 'not found', message: 'Funds not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By Category:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By Date
  async getFundsByDate(req, res) {
    const fundModel = new FundModal();
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start Date and End Date is required' });
    }

    try {
      const result = await fundModel.getFundsByDate(start_date, end_date);
      if (result.length > 0) {
        res.json({ status: 'success', message: 'Executed Successfully', results: { total: result?.length, data: result } });
      } else {
        res.status(404).json({ status: 'not found', message: 'Funds not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By Date:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }


  // Get Funds Category for Specific User
  async getFundsByCategoryAndUser(req, res) {
    const fundModel = new FundModal();
    const category = req.params.category;
    const user = req.params.user;

    if (!category && !user) {
      return res.status(400).json({ status: 'error', message: 'Category and User is required' });
    }

    try {
      const result = await fundModel.getFundsByCategoryAndUser(category, user);
      if (result.length > 0) {
        res.json({
          status: 'success',
          message: 'Executed Successfully',
          results: {
            total: result?.length,
            totalAmount: result.map((fund) => fund.money).reduce((p, n) => p + n, 0),
            data: result
          }
        });
      } else {
        res.status(404).json({ status: 'not found', message: 'Funds not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By Category:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }



}

module.exports = new FundsController();