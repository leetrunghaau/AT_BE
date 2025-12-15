require('module-alias/register')
const express = require('express');
const { responseHandler, errorHandler, notFound } = require('@mids/response.middleware');
const apiRoutes = require('@routers/index'); 
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/cdn",express.static("public"));
app.use(express.json());
app.use(cors());
app.use(responseHandler);
app.use('/api', apiRoutes); 
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;