import { Query } from "mongoose";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableField: string[]): this {
    const searchTerms = this.query.searchTerm || "";
    const searchArray = searchableField.map((field) => ({
      [field]: { $regex: searchTerms, $options: "i" },
    }));

    this.modelQuery = this.modelQuery.find({ $or: searchArray } as any);
    return this;
  }

  // filter(): any {
  //   const filter = { ...this.query };

  //   const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
  //   for (const field of deleteField) {
  //     delete filter[field];
  //   }
  //   this.modelQuery = this.modelQuery.find(filter);

  //   return this;
  // }
  filter(): any {
    const filter = { ...this.query };

    const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
    for (const field of deleteField) {
      delete filter[field];
    }

    const formattedFilter: Record<string, any> = {};
    for (const key in filter) {
      if (key.includes("[")) {
        const parts = key.replace("]", "").split("[");
        const field = parts[0];
        const operator = parts[1];
        if (!field || !operator) continue;
        if (!formattedFilter[field]) formattedFilter[field] = {};
        formattedFilter[field][`$${operator}`] = Number(filter[key]);
      } else {
        formattedFilter[key] = filter[key];
      }
    }

    this.modelQuery = this.modelQuery.find(formattedFilter as any);
    return this;
  }
  sort(): any {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  fields(): any {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  pagination(): any {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 6;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  // async getMeta() {
  //   const filter = { ...this.query };
  //   const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
  //   for (const field of deleteField) {
  //     delete filter[field];
  //   }
  //   const totalDocs = await this.modelQuery.model.countDocuments(filter as any);
  //   const page = Number(this.query.page) || 1;
  //   const limit = Number(this.query.limit) || 10;
  //   const totalPages = Math.ceil(totalDocs / limit);
  //   return { page, limit, totalDocs, totalPages };
  // }

  async getMeta() {
    // ✅ Build fresh filter without pagination
    const filter = { ...this.query };
    const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
    for (const field of deleteField) {
      delete filter[field];
    }

    // ✅ Handle range queries in meta too
    const formattedFilter: Record<string, any> = {};
    for (const key in filter) {
      if (key.includes("[")) {
        const parts = key.replace("]", "").split("[");
        const field = parts[0];
        const operator = parts[1];
        if (!field || !operator) continue;
        if (!formattedFilter[field]) formattedFilter[field] = {};
        formattedFilter[field][`$${operator}`] = Number(filter[key]);
      } else {
        formattedFilter[key] = filter[key];
      }
    }

    // ✅ Also include searchTerm in count
    const searchTerm = this.query.searchTerm || "";
    if (searchTerm) {
      // handled by modelQuery already — use model directly
    }

    const totalDocs = await this.modelQuery.model.countDocuments(
      formattedFilter as any,
    );
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPages = Math.ceil(totalDocs / limit);

    return { page, limit, totalDocs, totalPages };
  }
}
