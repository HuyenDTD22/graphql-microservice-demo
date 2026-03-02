# graphql-microservice-demo

#BFF(Backend For Frontend) - GraphQL làm API Gateway

- Hệ thống gồm 3 service:
  + user-service: chạy cổng 4001
  + order-service: chạy cổng 4002
  + product-service: chạy cổng 4003
  + gateway (GraphQL BFF): chạy cổng 4000
  + frontend (React): chạy cổng 3000
 
- Kiến trúc: Frontend → GraphQL Gateway → REST Microservices

- Sau khi clone về, ở terminal:
  + cd user-service : chạy lệnh npm install
  + cd product-service : chạy lệnh npm install
  + cd order-service : chạy lệnh npm install
  + cd gateway : chạy lệnh npm install
  + cd frontend : chạy lệnh npm install
  + Kết nối mongoDB Compass, đảm bảo kết nối tới: mongodb://localhost:27017

 - Chạy application, ở terminal:
   + cd user-service : chạy lệnh npm start
   + cd product-service : chạy lệnh npm start
   + cd order-service : chạy lệnh npm start
   + cd gateway : chạy lệnh npm start
   + cd frontend : chạy lệnh npm start

#GraphQL Federation : làm tương tự như hướng dẫn bên trên
