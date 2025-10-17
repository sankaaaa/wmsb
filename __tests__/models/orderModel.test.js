const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const Order = require("../../backend/models/Order");

describe("Order Model Schema", () => {
    test("should have the correct schema fields", () => {
        const schemaPaths = Object.keys(Order.schema.paths);

        expect(schemaPaths).toEqual(
            expect.arrayContaining([
                "_id",
                "customerName",
                "customerEmail",
                "providerEmail",
                "products",
                "totalPrice",
                "comment",
                "status",
                "createdAt",
                "__v"
            ])
        );
    });

    test("should have correct data types for each field", () => {
        const { schema } = Order;

        expect(schema.path("customerName").instance).toBe("String");
        expect(schema.path("customerEmail").instance).toBe("String");
        expect(schema.path("providerEmail").instance).toBe("String");
        expect(schema.path("products").instance).toBe("Array");
        expect(schema.path("totalPrice").instance).toBe("Number");
        expect(schema.path("comment").instance).toBe("String");
        expect(schema.path("status").instance).toBe("String");
        expect(schema.path("createdAt").instance).toBe("Date");
    });

    test("should use 'orders' as collection name", () => {
        expect(Order.collection.name).toBe("orders");
    });
});
