const DriverService = require("../services/driver.service");

class DriverController {
  async create(req, res, next) {
    try {
      const driver = await DriverService.create(req.body);
      res.ok(driver.data, driver.meta);
    } catch (error) {
      next(error);
    }
  }

  async createBulk(req, res, next) {
    try {
      await DriverService.createBulk(req.body);
      const drivers = await DriverService.getAll(1, 10, { id: req.body.map(item => item.id) });
      res.ok(drivers.data, drivers.pagination, drivers.meta);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { p, l, s } = req.useQuery;
      const drivers = await DriverService.getAll(p, l, { name: s });
      res.ok(drivers.data, drivers.pagination, drivers.meta);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.useParams;
      const student = await DriverService.getById(id);
      res.ok(student);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const driver = await DriverService.update(id, req.body);
      res.ok(driver.data, driver.pagination);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.useParams;
      const driver = await DriverService.delete(id);
      res.ok(driver.data, driver.pagination);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();