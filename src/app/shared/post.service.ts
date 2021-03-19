import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FirebaseCreateResponse, Post} from "./interfaces";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class PostService {
  constructor(
    private http: HttpClient
  ) {
  }

  create(post: Post): Observable<Post> {
    return this.http.post<any>(`${environment.firebaseDatabaseUrl}/posts.json`, post)
      .pipe(map((response: FirebaseCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.firebaseDatabaseUrl}/posts.json`)
      .pipe(map((response: {[key: string]: any}) => {
        return Object.keys(response).map(key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }));
    }));
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.firebaseDatabaseUrl}/posts/${id}.json`)
      .pipe(map((post: Post) => ({
        ...post,
        id,
        date: new Date(post.date)
      })));
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.firebaseDatabaseUrl}/posts/${post.id}.json`, post);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.firebaseDatabaseUrl}/posts/${id}.json`);
  }
}
