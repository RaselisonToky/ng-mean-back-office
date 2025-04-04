export interface SupplierOrder {
    _id: string;
    supplier_id: any;
    order_date: string;
    ticket_number: string;
    status: string;
    total_amount: number;
}

export interface SupplierOrderTicket {
    _id: string;
    ticket_number: string;
}