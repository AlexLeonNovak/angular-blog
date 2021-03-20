import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];
  protected postSubscription: Subscription = new Subscription();
  protected deleteSubscription: Subscription = new Subscription();
  search = '';

  constructor(
    private postService: PostService,
    private alert: AlertService
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
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  remove(id: string): void {
    this.deleteSubscription = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(p => p.id !== id);
      this.alert.success('Post was deleted');
    });
  }
}
