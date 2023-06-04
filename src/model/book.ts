export default class Book {
    readonly id: number;
    readonly title: string;
    readonly synopsis: string;
    readonly author: string;
    readonly price: number;
    readonly createdAt: Date;

    constructor(
        id: number,
        title: string,
        synopsis: string,
        author: string,
        price: number,
        createdAt: Date,
    ) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.author = author;
        this.price = price;
        this.createdAt = createdAt;
    }
}
