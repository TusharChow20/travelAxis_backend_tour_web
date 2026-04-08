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

  filter(): any {
    const filter = { ...this.query };

    const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
    for (const field of deleteField) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);

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
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const filter = { ...this.query };
    const deleteField = ["searchTerm", "sort", "fields", "page", "limit"];
    for (const field of deleteField) {
      delete filter[field];
    }
    const totalDocs = await this.modelQuery.model.countDocuments(filter as any);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPages = Math.ceil(totalDocs / limit);
    return { page, limit, totalDocs, totalPages };
  }
}
