export interface noteDetailItem {
    _id: string;
    author: Author;
    commentCount: number;
    comments: Comment[];
    content: string;
    createdAt: string;
    images: string[];
    likes: number;
    location: string;
    title: string;
    views: number;
}

export interface Author {
    avatar: string;
    id: string;
    nickname: string;
}

export interface Comment {
    avatar: string;
    content: string;
    createdAt: string;
    username: string;
    [property: string]: any;
}
