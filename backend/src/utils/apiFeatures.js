/**
 * Small helper used by controllers to apply consistent search / filter /
 * sort / pagination behaviour across Packages and Hotels list endpoints.
 *
 * Usage:
 *   const features = new ApiFeatures(Hotel.find(), req.query)
 *     .search(['name', 'city', 'address'])
 *     .filter()
 *     .sort()
 *     .paginate();
 *   const results = await features.query;
 *   const total = await features.countTotal();
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.modelQuery = query.model.find(); // separate query for counting
  }

  search(fields = []) {
    if (this.queryString.q && fields.length) {
      const regex = new RegExp(this.queryString.q, 'i');
      const orConditions = fields.map((field) => ({ [field]: regex }));
      this.query = this.query.find({ $or: orConditions });
      this.modelQuery = this.modelQuery.find({ $or: orConditions });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ['q', 'sort', 'page', 'limit', 'fields'];
    excluded.forEach((field) => delete queryObj[field]);

    // Support price ranges: minPrice / maxPrice
    const mongoFilter = {};
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value === undefined || value === '') return;
      mongoFilter[key] = value;
    });

    if (this.queryString.minPrice || this.queryString.maxPrice) {
      mongoFilter.price = {};
      if (this.queryString.minPrice) mongoFilter.price.$gte = Number(this.queryString.minPrice);
      if (this.queryString.maxPrice) mongoFilter.price.$lte = Number(this.queryString.maxPrice);
      delete mongoFilter.minPrice;
      delete mongoFilter.maxPrice;
    }

    if (this.queryString.minRating) {
      mongoFilter.rating = { $gte: Number(this.queryString.minRating) };
      delete mongoFilter.minRating;
    }

    this.query = this.query.find(mongoFilter);
    this.modelQuery = this.modelQuery.find(mongoFilter);
    return this;
  }

  sort() {
    const sortMap = {
      price_asc: 'price',
      price_desc: '-price',
      rating_desc: '-rating',
      newest: '-createdAt',
      popular: '-bookingsCount',
    };
    const sortBy = sortMap[this.queryString.sort] || '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }

  async countTotal() {
    return this.modelQuery.countDocuments();
  }
}

export default ApiFeatures;
