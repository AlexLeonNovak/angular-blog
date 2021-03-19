import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashpoard-page',
  templateUrl: './dashpoard-page.component.html',
  styleUrls: ['./dashpoard-page.component.scss']
})
export class DashpoardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubscription: Subscription = new Subscription();

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.postSubscription = this.postService.getAll().subscribe(posts => {
      console.log(posts);
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  remove(id: string): void {
    console.log(id);
  }
}
