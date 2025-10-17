const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const Item = require("../../backend/models/Item");

describe("Item Model Schema", () => {
    test("should have the correct schema fields", () => {
        const schemaPaths = Object.keys(Item.schema.paths);

        expect(schemaPaths).toEqual(
            expect.arrayContaining([
                "_id",
                "name",
                "quantity",
                "price",
                "description",
                "type",
                "photo",
                "__v"
            ])
        );
    });

    test("should have correct data types for each field", () => {
        const { schema } = Item;

        expect(schema.path("name").instance).toBe("String");
        expect(schema.path("quantity").instance).toBe("Number");
        expect(schema.path("price").instance).toBe("Number");
        expect(schema.path("description").instance).toBe("String");
        expect(schema.path("type").instance).toBe("String");
        expect(schema.path("photo").instance).toBe("String");
    });

    test("should use 'storage' as collection name", () => {
        expect(Item.collection.name).toBe("storage");
    });
});
