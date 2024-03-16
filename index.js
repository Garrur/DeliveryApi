const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const distances = {
  'C1': { 'C2': 4, 'L1': 3 },
  'C2': { 'L1': 2.5, 'C3': 3 },
  'C3': { 'L1': 2, 'C2': 3}
};


const costPerUnitDistance = {
  '0-5': 10,
  '6+': 8,
};


const productWeights = {
  'A': 3,
  'B': 2,
  'C': 8,
  'D': 12,
  'E': 25,
  'F': 15,
  'G': 0.5,
  'H': 1,
  'I': 2
};


function calculateTotalWeight(order) {
  let totalWeight = 0;
  for (const product in order) {
    totalWeight += order[product] * productWeights[product];
  }
  return totalWeight;
}


function calculateMinimumCost(order) {
  const totalWeight = calculateTotalWeight(order);
  let minCost = 0;

  for (const center in distances) {
    const distanceToL1 = distances[center]['L1'];
    const costPerUnit = totalWeight <= 5 ? costPerUnitDistance['0-5'] : costPerUnitDistance['0-5'] + Math.ceil((totalWeight - 5) / 5) * costPerUnitDistance['6+'];
    const totalCost = distanceToL1 * costPerUnit;

    if (totalCost > minCost) {
      minCost = totalCost;
    }
  }

  return minCost;
}

app.get('/', (req, res) => {
  // Message for Postman usage
  const message = 'For Postman: Send a POST request to site_url/calculateMinimumCost with the following request body: {"A": 1, "B": 1, "C": 1}';
  res.send(message);
});
app.post('/calculateMinimumCost', (req, res) => {
  const order = req.body;
  if (!order) {
    return res.status(400).json({ error: 'Order details not provided' });
  }

  const minimumCost = calculateMinimumCost(order);
  return res.json({ minimumCost });
});


app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});