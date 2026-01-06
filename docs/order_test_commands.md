## 1. Create Order
```bash
curl -X POST http://localhost:8085/api/orders \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"items": [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 1}]}'
```

## 2. List Orders (Filter by status)
```bash
curl -i "http://localhost:8085/api/orders?status=pending"
```

## 3. Confirm Order (Replace {order_id})
```bash
curl -i -X POST http://localhost:8085/api/orders/{order_id}/confirm \
  -H "Accept: application/json"
```

## 4. Check Stock (Replace {product_id})
```bash
curl -i http://localhost:8085/api/products/{product_id}
```
