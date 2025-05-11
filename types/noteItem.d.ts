export interface noteItem {
    _id?: string;
    author?: Author;
    coverImage?: string;
    title?: string;
    views?: number;
    _height?:number
}

export interface Author {
    avatar: string;
    nickname: string;
}
