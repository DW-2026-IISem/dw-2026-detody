export declare class CreateSaleItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateSaleDto {
    clientId: number;
    items: CreateSaleItemDto[];
}
