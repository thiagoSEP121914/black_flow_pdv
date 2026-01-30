// divida técnica refatorar para encurtar e abstrair esse componente
import { Modal } from "@/shared/components/Modal/Modal";
import { Button } from "@/shared/components/ui/Button";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createProductSchema,
    type CreateProductInput,
} from "../schemas/product.schema";
import { useEffect, useRef, useState } from "react";
import { Package, Save, Image as ImageIcon, Upload } from "lucide-react";
import calculateMargin from "../domain/calculateMargin";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: CreateProductInput | null; // For edit mode later
}

export const ProductModal = ({
    isOpen,
    onClose,
    product,
}: ProductModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            active: true,
            quantity: 0,
        },
    });

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (product) {
                reset(product);
            } else {
                reset({
                    active: true,
                    quantity: 0,
                    name: "",
                    barcode: "",
                    salePrice: 0,
                    costPrice: 0,
                    minStock: 10,
                });
            }
        }
    }, [isOpen, product, reset]);

    // Calculate Margin
    const salePrice = useWatch({ control, name: "salePrice" });
    const costPrice = useWatch({ control, name: "costPrice" });

    const margin = calculateMargin(Number(salePrice), Number(costPrice));

    const onSubmit = async (data: CreateProductInput) => {
        try {
            console.log("Submitting:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header
                    onClose={onClose}
                    icon={<Package className="w-5 h-5 text-emerald-600" />}
                >
                    <div className="flex flex-col">
                        <span>{product ? "Editar Produto" : "Novo Produto"}</span>
                        <span className="text-xs font-normal text-gray-500 mt-1">
                            Cadastre ou edite informações do produto
                        </span>
                    </div>
                </Modal.Header>

                <Modal.Content className="space-y-6">
                    {/* Active Switch */}
                    {/* Photo Upload Section */}
                    {/* Photo Upload Section */}
                    <div className="space-y-4">
                        <span className="text-sm font-medium text-gray-700">
                            Foto do Produto
                        </span>
                        <div className="flex items-center gap-6">
                            {/* Image Preview / Placeholder */}
                            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-300 overflow-hidden relative">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-8 h-8" />
                                )}
                            </div>

                            {/* Upload Actions */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    className="gap-2 w-fit shadow-sm rounded-xl"
                                    onClick={handleImageUploadClick}
                                >
                                    <Upload className="w-4 h-4" />
                                    Enviar Foto
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                />
                                <span className="text-xs text-gray-400 font-normal">
                                    JPG, PNG ou WebP. Máx 2MB.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">
                            Produto Ativo
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                {...register("active")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Nome do Produto <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name")}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                            placeholder="Ex: Coca-Cola 2L"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Categoria <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("categoryId")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800 bg-white"
                            >
                                <option value="">Selecione</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="alimentos">Alimentos</option>
                                <option value="limpeza">Limpeza</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Código de Barras
                            </label>
                            <input
                                {...register("barcode")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                placeholder="Ex: 7891234567890"
                            />
                        </div>
                    </div>

                    {/* Pricing Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Preço Venda (R$) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("salePrice")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800"
                            />
                            {errors.salePrice && (
                                <p className="text-xs text-red-500">
                                    {errors.salePrice.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Custo (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("costPrice")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Margem Estimada
                            </label>
                            <div className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-medium">
                                {margin.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {/* Stock Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Estoque Atual
                            </label>
                            <input
                                type="number"
                                {...register("quantity")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Estoque Mínimo
                            </label>
                            <input
                                type="number"
                                {...register("minStock")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-gray-800"
                            />
                        </div>
                    </div>
                </Modal.Content>

                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            "Salvando..."
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Cadastrar
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};
