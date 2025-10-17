const {TextEncoder, TextDecoder} = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const request = require("supertest");

jest.mock("../backend/models/Item");
jest.mock("../backend/models/Order");

const Item = require("../backend/models/Item");
const Order = require("../backend/models/Order");

const app = require("../backend/app");

describe("---------Database routes (GET & POST)---------", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ====================== ITEMS ======================
    test("GET /api/items → returns all items from DB", async () => {
        const mockItems = [
            {_id: "1", name: "Beer", type: "beer", quantity: 10},
            {_id: "2", name: "Wine", type: "wine", quantity: 5},
        ];

        Item.find.mockResolvedValue(mockItems);

        const res = await request(app).get("/api/items").expect(200);

        expect(Item.find).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual(mockItems);
    });

    test("POST /api/items → saves new item to DB", async () => {
        const newItem = {name: "Whiskey", type: "strong", quantity: 3};
        const savedItem = {_id: "99", ...newItem};

        Item.mockImplementation(function (data) {
            this._doc = data;
            this.save = jest.fn().mockResolvedValue(savedItem);
        });

        const res = await request(app).post("/api/items").send(newItem).expect(200);

        expect(Item).toHaveBeenCalledWith(newItem);
        expect(res.body).toEqual(savedItem);
    });

    // ====================== ORDERS ======================
    test("GET /api/orders → returns all orders from DB", async () => {
        const mockOrders = [
            {_id: "a1", customerName: "Alice", totalPrice: 25},
            {_id: "a2", customerName: "Bob", totalPrice: 40},
        ];

        const sortMock = jest.fn().mockResolvedValue(mockOrders);
        Order.find.mockReturnValue({sort: sortMock});

        const res = await request(app).get("/api/orders").expect(200);

        expect(Order.find).toHaveBeenCalledTimes(1);
        expect(sortMock).toHaveBeenCalledWith({createdAt: -1});
        expect(res.body).toEqual(mockOrders);
    });

    test("POST /api/orders → saves new order to DB", async () => {
        const orderData = {
            customerName: "John",
            customerEmail: "john@example.com",
            providerEmail: "provider@example.com",
            products: [{name: "Beer", quantity: 2, price: 5}],
            totalPrice: 10,
            comment: "Quick delivery",
        };
        const savedOrder = {_id: "ord1", ...orderData};

        Order.mockImplementation(function (data) {
            this._doc = data;
            this.save = jest.fn().mockResolvedValue(savedOrder);
        });

        const res = await request(app).post("/api/orders").send(orderData).expect(201);

        expect(Order).toHaveBeenCalledWith(orderData);
        expect(res.body).toEqual(savedOrder);
    });
});
