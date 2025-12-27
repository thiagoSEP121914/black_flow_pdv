export type SearchInput = {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_dir?: "asc" | "desc";
    filter?: string | null;
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

export interface IRepository<Model, Obj> {
    findAll(params: SearchInput): Promise<SearchOutPut<Model>>;

    findById(id: string): Promise<Model>;

    create(data: Obj): Model;

    insert(model: Model): Promise<Model>;

    update(model: Model): Promise<Model>;

    delete(id: string): Promise<void>;
}
