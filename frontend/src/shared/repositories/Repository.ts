import api from "../api/Api.js";

export abstract class Repository<T> {
  protected resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  protected get client() {
    return api;
  }

  async findAll(params?: Record<string, unknown>): Promise<T[]> {
    const { data } = await this.client.get<T[]>(this.resource, { params });
    return data;
  }

  async findById(id: string): Promise<T> {
    const { data } = await this.client.get<T>(`${this.resource}/${id}`);
    return data;
  }

  async insert(payload: Partial<T>): Promise<T> {
    const { data } = await this.client.post<T>(this.resource, payload);
    return data;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    const { data } = await this.client.put<T>(
      `${this.resource}/${id}`,
      payload
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`${this.resource}/${id}`);
  }
}
