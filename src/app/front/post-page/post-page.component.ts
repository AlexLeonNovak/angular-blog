import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../shared/interfaces";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable} from "rxjs";
import {PostService} from "../../shared/post.service";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  public post$: Observable<Post>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.post$ = this.route.params.pipe(switchMap((params: Params) => {
      return this.postService.getById(params.id);
    }));
  }

  ngOnInit(): void {
  }

}
