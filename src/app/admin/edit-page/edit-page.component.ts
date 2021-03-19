import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {switchMap} from "rxjs/operators";
import {Post} from "../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  public Editor = ClassicEditor;
  private post: Post | undefined;
  form: FormGroup | undefined;
  submitted = false;

  protected updateSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}


  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params.id);
      })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      });
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (!this.form || this.form.invalid || !this.post) {
      return;
    }

    this.submitted = true;

    this.updateSubscription = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(() => {
      this.submitted = false;
    });
  }

}
