const router = require("express").Router();
const supControllers = require("../controllers/supControllers");
const MatControllers = require("../controllers/supControllers");
const Sup = require("../model/supModel");


router.post("/addsup", supControllers.addsup);

router.get("/getSuppliers", supControllers.getEmployees);

router.get("/getSupplier/:id", supControllers.getEmployee);

router.put("/updateSupplier/:id", supControllers.updateEmployee);

router.delete("/deleteSupplier/:id", supControllers.deleteEmployee);

router.delete("/updatePayment/:id", supControllers.updatePayment);

router.get("/materialCost", MatControllers.getAllPyment);

//cost
router.put("/materialCost/:id", (req, res) => {
  const { id } = req.params;
  const { month, amount } = req.body;

  // Input validation
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  if (!month || typeof month !== 'string' || month.length > 20) {
    return res.status(400).json({ success: false, message: 'Invalid month' });
  }

  if (amount === undefined || amount === null) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  // Validate amount is a number and positive
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
  }

  // Sanitize month input
  const sanitizedMonth = month.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

  const matcostUpdate = { [`materialCost.${sanitizedMonth}`]: numAmount };
  Sup.findByIdAndUpdate(id, {
    $set: matcostUpdate,
  })
    .then(() => {
      return res.status(200).json({
        success: "Updated Syccesfully",
      });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

module.exports = router;


