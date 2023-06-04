export default class Book {
    private _id: number;
    private _title: string;
    private _synopsis: string;
    private _author: string;
    private _price: number;
    private _createdAt: Date;

    constructor(
        id: number,
        title: string,
        synopsis: string,
        author: string,
        price: number,
        createdAt: Date,
    ) {
        this._id = id;
        this._title = title;
        this._synopsis = synopsis;
        this._author = author;
        this._price = price;
        this._createdAt = createdAt;
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get synopsis(): string {
        return this._synopsis;
    }

    get author(): string {
        return this._author;
    }

    get price(): number {
        return this._price / 100;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
