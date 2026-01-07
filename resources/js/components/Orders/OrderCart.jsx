import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react"

const OrderCart = ({ cart, onUpdateQuantity, onRemove, onSubmit, onCancel, submitting }) => {
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="bg-muted/50 pb-4">
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
                    </span>
                    {cart.length > 0 && (
                        <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Your cart is empty</p>
                        <p className="text-sm">Add items to view them here.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.product_id}>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-1">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">${item.price.toFixed(2)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center space-x-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onRemove(item.product_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            {cart.length > 0 && (
                <CardFooter className="flex flex-col gap-4 border-t bg-muted/50 p-6">
                    <div className="flex w-full justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-2xl font-bold">${calculateTotal()}</span>
                    </div>
                    <div className="flex w-full gap-4">
                        <Button variant="outline" className="w-full" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            className="w-full"
                            onClick={onSubmit}
                            disabled={submitting}
                        >
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default OrderCart;
