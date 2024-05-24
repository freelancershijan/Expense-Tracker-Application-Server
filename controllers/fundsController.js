const fundsModel = require("../models/fundModel")()

function fundsController() {
  // Post  a FUnd
  const createFund = async (req, res) => {
    const value = req.body;
    try {
      const result = await fundsModel.createFund(value);
      const createdID = result?.insertedId;
      if (createdID) {
        const createdFund = await fundsModel.getFundByID(createdID);
        res.json({
          status: 'success',
          message: 'Executed Successfully',
          results: createdFund
        });
      }
    } catch (err) {
      console.error('Error Posting Funds:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Update a FUnd
  const updateFundByID = async (req, res) => {
    const { id } = req.query
    const value = req.body;
    try {
      const result = await fundsModel.updateFundByID(id, value);
      if (result) {
        const updatedFund = await fundsModel.getFundByID(id);
        res.json({
          status: 'success',
          message: 'Executed Successfully',
          results: updatedFund
        });
      }

    } catch (err) {
      console.error('Error Posting Funds:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }


  // Get All Funds
  const getAllFunds = async (req, res) => {
    try {
      const result = await fundsModel.getAllFunds();
      res.json({
        status: 'success', message: 'Executed Successfully', results: {
          total: result?.length,
          totalAmount: result?.map((fund) => fund.money)?.reduce((p, n) => p + n, 0),
          data: result
        }
      });
    } catch (err) {
      console.error('Error getting FUnds:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By IID
  const getFundByID = async (req, res) => {

    const fundID = req.params.id;

    if (!fundID) {
      return res.status(400).json({ status: 'error', message: 'FUnd ID is required' });
    }

    try {
      const result = await fundsModel.getFundByID(fundID);
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

  // Delete FUnds By IID
  const deleteFundByID = async (req, res) => {
    const fundID = req.params.id;

    if (!fundID) {
      return res.status(400).json({ status: 'error', message: 'FUnd ID is required' });
    }

    try {
      const result = await fundsModel.deleteFundByID(fundID);
      if (result) {
        res.json({ status: 'success', message: 'Executed Successfully' });
      } else {
        res.status(404).json({ status: 'not found', message: 'Fund not found' });
      }
    } catch (err) {
      console.error('Error deleting Fund By ID:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By User Email
  const getFundsByUserEmail = async (req, res) => {
    const userEmail = req.params.user;

    if (!userEmail) {
      return res.status(400).json({ status: 'error', message: 'User Email ID is required' });
    }

    try {
      const result = await fundsModel.getFundsByUserEmail(userEmail);
      if (result.length > 0) {
        res.json({
          status: 'success', message: 'Executed Successfully', results: {
            total: result?.length,
            totalAmount: result?.map((fund) => fund.money)?.reduce((p, n) => p + n, 0),
            data: result
          }
        });
      } else {
        res.status(404).json({ status: 'not found', message: 'Fund not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By ID:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  // Get FUnds By Category
  const getFundsByCategory = async (req, res) => {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ status: 'error', message: 'Category is required' });
    }

    try {
      const result = await fundsModel.getFundsByCategory(category);
      if (result.length > 0) {
        res.json({
          status: 'success', message: 'Executed Successfully', results: {
            total: result?.length,
            totalAmount: result?.map((fund) => fund.money)?.reduce((p, n) => p + n, 0),
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

  // Delete Category for a User
  const deleteFundsCategoryByUser = async (req, res) => {

    const { category, user } = req.query;

    console.log('Category: ', category, 'User: ', user);
    if (!category || !user) { // Check for category and user
      return res.status(400).json({ status: 'error', message: 'Category and User Email are required' });
    }

    try {
      const deletedCount = await fundsModel.deleteFundsCategoryByUser(category, user);
      if (deletedCount > 0) {
        res.json({ status: 'success', message: 'Executed Successfully', deletedCount: deletedCount });
      } else {
        res.status(404).json({ status: 'not found', message: 'No funds found for the specified category and user' });
      }
    } catch (err) {
      console.error('Error deleting Fund Category:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }


  // Get FUnds By Date
  const getFundsByDate = async (req, res) => {

    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start Date and End Date is required' });
    }

    try {
      const result = await fundsModel.getFundsByDate(start_date, end_date);
      if (result.length > 0) {
        res.json({
          status: 'success', message: 'Executed Successfully', results: {
            total: result?.length,
            totalAmount: result?.map((fund) => fund.money)?.reduce((p, n) => p + n, 0),
            data: result
          }
        });
      } else {
        res.status(404).json({ status: 'not found', message: 'Funds not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By Date:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }


  // Get Funds Category for Specific User
  const getFundsByCategoryAndUser = async (req, res) => {

    // const category = req.params.category;
    // const user = req.params.user;
    const { category, user } = req.query;
    console.log('User:', user, 'Category:', category);

    if (!category && !user) {
      return res.status(400).json({ status: 'error', message: 'Category and User is required' });
    }

    try {
      const result = await fundsModel.getFundsByCategoryAndUser(category, user);
      if (result?.length > 0) {
        res.json({
          status: 'success',
          message: 'Executed Successfully',
          results: {
            total: result?.length,
            totalAmount: result?.map((fund) => fund.money)?.reduce((p, n) => p + n, 0),
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

  // Get a user all category name and Money
  const getFundCategoryWithValue = async (req, res) => {

    const userEmail = req.params.user;

    if (!userEmail) {
      return res.status(400).json({ status: 'error', message: 'User Email ID is required' });
    }

    try {
      const result = await fundsModel.getFundCategoryWithValue(userEmail);
      if (result.length > 0) {
        res.json({
          status: 'success', message: 'Executed Successfully', results: {
            total: result?.length,
            totalAmount: result?.map((fund) => fund.value)?.reduce((p, n) => p + n, 0),
            data: result
          }
        });
      } else {
        res.status(404).json({ status: 'not found', message: 'Fund not found' });
      }
    } catch (err) {
      console.error('Error getting Fund By User:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  return {
    createFund,
    updateFundByID,
    getAllFunds,
    getFundByID,
    deleteFundByID,
    getFundsByUserEmail,
    getFundsByCategory,
    deleteFundsCategoryByUser,
    getFundsByDate,
    getFundsByCategoryAndUser,
    getFundCategoryWithValue
  }

}

module.exports = fundsController;