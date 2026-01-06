# How to Test Phase 2 (Product API)

Run these commands in your terminal to verify the API.

## 1. List Products (Initially empty)
```bash
curl -i http://localhost:8085/api/products
```

## 2. Create a Product (Success)
```bash
curl -i -X POST http://localhost:8085/api/products \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "test product", "price": 100, "stock_quantity": 50}'
```

## 3. Create an Invalid Product (Validation Error)
```bash
curl -i -X POST http://localhost:8085/api/products \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "", "price": -50}'
```
*Expected: 422 Unprocessable Content*

## 4. Get Specific Product (Replace ID with ID from step 2)
```bash
curl -i http://localhost:8085/api/products/1
```

## 5. Update Product
```bash
curl -i -X PUT http://localhost:8085/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 150}'
```

## 6. Delete Product
```bash
curl -i -X DELETE http://localhost:8085/api/products/1
```
