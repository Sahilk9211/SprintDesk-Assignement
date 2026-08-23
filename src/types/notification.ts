// Raw response shape from JSONPlaceholder polling endpoint
// GET https://jsonplaceholder.typicode.com/posts?_limit=5
export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
