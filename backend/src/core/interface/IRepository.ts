export type SearchInput = {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_dir?: "asc" | "desc";
    filter?: string | null;
    companyId: string;
};

export type SearchOutPut<Model> = {
    items: Model[];
    per_page: number;
    total: number;
    current_page: number;
    sort_by: string | null;
    sort_dir: string | null;
    filter: string | null;
};

export interface IRepository<Model, createData> {
    findAll(params: SearchInput): Promise<SearchOutPut<Model>>;

    findById(id: string): Promise<Model>;

    insert(model: createData): Promise<Model>;

    update(model: Model): Promise<Model>;

    delete(id: string): Promise<void>;
}
